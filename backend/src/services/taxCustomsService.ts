import { config } from '../config';
import { getSupabaseClient } from '../config/supabase';
import { CustomsRule, VATRefundRule } from '../types';
import { ExchangeRateService } from './exchangeRateService';

export interface TaxCustomsComputation {
  vatRefundPct: number;
  vatRefundAmountTry: number;
  imeiFeeTry: number;
  trtBandrolFeeTry: number;
  totalCustomsDutiesTry: number;
  taxRefundMethod: string;
  customsAlert?: string;
  quotaRule?: string;
}

export class TaxCustomsService {
  private fxService = ExchangeRateService.getInstance();
  private vatRulesCache: Map<string, VATRefundRule> = new Map();
  private customsRulesCache: Map<string, CustomsRule> = new Map();
  private isLoaded = false;

  private async loadRules(): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const [vatRes, customsRes] = await Promise.all([
        supabase.from('vat_rules').select('*'),
        supabase.from('customs_regulations').select('*'),
      ]);

      if (vatRes.data) {
        this.vatRulesCache.clear();
        for (const row of vatRes.data) {
          this.vatRulesCache.set(row.country_code.toUpperCase(), {
            countryCode: row.country_code,
            countryName: row.country_name,
            standardVatRate: parseFloat(row.standard_vat_rate || '0'),
            minSpendAmount: parseFloat(row.min_spend_amount || '0'),
            netRefundPctMin: parseFloat(row.net_refund_pct_min || '0'),
            netRefundPctMax: parseFloat(row.net_refund_pct_max || '0'),
            refundOperator: row.refund_operator || 'None',
            hasTouristVatRefund: row.has_tourist_vat_refund ?? false,
            refundProcessType: row.refund_process_type || 'airport_customs_stamp',
            notes: row.notes || '',
          });
        }
      }

      if (customsRes.data) {
        this.customsRulesCache.clear();
        for (const row of customsRes.data) {
          this.customsRulesCache.set(row.category_code.toLowerCase(), {
            targetCountryCode: row.target_country_code,
            categoryCode: row.category_code,
            personalAllowanceQty: parseInt(row.personal_allowance_qty || '1', 10),
            imeiFeeTry: parseFloat(row.imei_fee_try || '0'),
            trtBandrolFeeEur: parseFloat(row.trt_bandrol_fee_eur || '0'),
            requiresImeiRegistration: row.requires_imei_registration ?? false,
            passengerQuotaRule: row.passenger_quota_rule || '',
            notes: row.notes || '',
            effectiveYear: parseInt(row.effective_year || '2025', 10),
          });
        }
      }

      this.isLoaded = true;
    } catch (err: any) {
      console.warn('[TaxCustomsService] Failed to load rules from Supabase:', err.message);
    }
  }

  public async getAllVATRules(): Promise<VATRefundRule[]> {
    if (!this.isLoaded) {
      await this.loadRules();
    }
    return Array.from(this.vatRulesCache.values());
  }

  public async getAllCustomsRules(): Promise<CustomsRule[]> {
    if (!this.isLoaded) {
      await this.loadRules();
    }
    return Array.from(this.customsRulesCache.values());
  }

  public async getVATRule(countryCode: string): Promise<VATRefundRule | null> {
    if (!this.isLoaded) {
      await this.loadRules();
    }
    return this.vatRulesCache.get(countryCode.toUpperCase()) || null;
  }

  public async getCustomsRule(categoryCode: string): Promise<CustomsRule | null> {
    if (!this.isLoaded) {
      await this.loadRules();
    }
    return this.customsRulesCache.get(categoryCode.toLowerCase()) || null;
  }

  /**
   * Calculates net VAT refund and Turkish customs fees (IMEI & TRT Bandrol)
   */
  public async computeTaxesAndCustoms(
    countryCode: string,
    categoryCode: string,
    abroadPriceOriginal: number,
    currencyCode: string,
    abroadPriceTry: number
  ): Promise<TaxCustomsComputation> {
    const vatRule = await this.getVATRule(countryCode);
    const customsRule = await this.getCustomsRule(categoryCode);

    // 1. VAT Refund Calculation
    let vatRefundPct = 0;
    let vatRefundAmountTry = 0;
    let taxRefundMethod = 'KDV / Tax-Free iadesi bulunmuyor';

    if (vatRule && vatRule.hasTouristVatRefund) {
      // Check minimum spending threshold in local currency
      if (abroadPriceOriginal >= vatRule.minSpendAmount) {
        vatRefundPct = vatRule.netRefundPctMax;
        vatRefundAmountTry = Math.round(abroadPriceTry * (vatRefundPct / 100) * 100) / 100;
        taxRefundMethod = `${vatRule.refundOperator} (%${vatRefundPct} net iade)`;
      } else {
        taxRefundMethod = `Minimum harcama tutarının altında (${vatRule.minSpendAmount} ${currencyCode})`;
      }
    } else if (countryCode.toUpperCase() === 'GB') {
      taxRefundMethod = 'İngiltere Brexit sonrası turist Tax-Free uygulamasını kaldırdı (%0 iade)';
    } else if (countryCode.toUpperCase() === 'US') {
      taxRefundMethod = 'ABD Eyalet Satış Vergisi yabancı turistlere iade edilmez (%0 iade)';
    }

    // 2. Turkish Customs & Regulatory Fees
    let imeiFeeTry = 0;
    let trtBandrolFeeTry = 0;
    let customsAlert: string | undefined;
    let quotaRule: string | undefined;

    if (customsRule) {
      quotaRule = customsRule.passengerQuotaRule;

      if (customsRule.requiresImeiRegistration) {
        imeiFeeTry = config.customsTR.imeiFeeTry;
        trtBandrolFeeTry = await this.fxService.convertToTRY(
          customsRule.trtBandrolFeeEur,
          'EUR'
        );
        customsAlert = `Türkiye IMEI kayıt harcı (${imeiFeeTry.toLocaleString('tr-TR')} ₺) + TRT Bandrolü (€${customsRule.trtBandrolFeeEur}) dahildir. Yolcunun T.C. kimlik numarasına kayıtlı olarak 3 takvim yılında 1 adet cihaz için geçerlidir.`;
      } else if (customsRule.trtBandrolFeeEur > 0) {
        trtBandrolFeeTry = await this.fxService.convertToTRY(
          customsRule.trtBandrolFeeEur,
          'EUR'
        );
        customsAlert = `TRT Bandrol Ücretine tabidir (€${customsRule.trtBandrolFeeEur} = ~${trtBandrolFeeTry.toLocaleString('tr-TR')} ₺).`;
      }
    }

    const totalCustomsDutiesTry = Math.round((imeiFeeTry + trtBandrolFeeTry) * 100) / 100;

    return {
      vatRefundPct,
      vatRefundAmountTry,
      imeiFeeTry,
      trtBandrolFeeTry,
      totalCustomsDutiesTry,
      taxRefundMethod,
      customsAlert,
      quotaRule,
    };
  }
}

