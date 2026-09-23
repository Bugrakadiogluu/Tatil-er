import { DatabaseService } from './db.js';

export interface ArbitrageOpportunity {
  rank: number;
  countryCode: string;
  countryName: string;
  cityName: string;
  retailerName: string;
  originalPrice: number;
  currencyCode: string;
  convertedPriceTry: number;
  vatRefundPct: number;
  vatRefundTry: number;
  customsFeesTry: number;
  netAbroadLandedCostTry: number;
  netSavingsTry: number;
  savingsPercentage: number;
  arbitrageRating: 'EXCELLENT_FREE_VACATION' | 'GREAT_SAVINGS' | 'MODERATE' | 'NOT_WORTH_IT';
  verdictTurkish: string;
}

export interface ProductArbitrageReport {
  productId: string;
  brand: string;
  modelName: string;
  categoryName: string;
  domesticRetailer: string;
  domesticPriceTry: number;
  bestOpportunity?: ArbitrageOpportunity;
  allOpportunities: ArbitrageOpportunity[];
}

export class ArbitrageCalculatorService {
  /**
   * Calculates arbitrage profitability for a given product across all monitored countries
   */
  public static async calculateArbitrageForProduct(productNameOrId: string): Promise<ProductArbitrageReport | null> {
    const supabase = DatabaseService.getClient();

    // 1. Query the live active arbitrage view created in Supabase
    let query = supabase
      .from('v_active_product_arbitrage')
      .select('*');

    // Filter by UUID or smart multi-keyword search
    let data: any[] | null = null;
    if (productNameOrId.length === 36 && productNameOrId.includes('-')) {
      const res = await supabase
        .from('v_active_product_arbitrage')
        .select('*')
        .eq('product_id', productNameOrId);
      data = res.data;
    } else {
      const clean = productNameOrId.trim();
      // Try direct match on model_name
      const resDirect = await supabase
        .from('v_active_product_arbitrage')
        .select('*')
        .ilike('model_name', `%${clean}%`);

      if (resDirect.data && resDirect.data.length > 0) {
        data = resDirect.data;
      } else {
        // Multi-word token search across brand + model_name
        const words = clean.toLowerCase().split(/\s+/).filter(w => w.length > 1);
        const { data: allRows } = await supabase.from('v_active_product_arbitrage').select('*');
        if (allRows) {
          // Find first product where all search terms match
          const matchingRows = allRows.filter(row => {
            const fullTitle = `${row.brand} ${row.model_name}`.toLowerCase();
            return words.every(w => fullTitle.includes(w));
          });
          if (matchingRows.length > 0) {
            // Group by the first matched product_id so we don't mix products
            const targetProdId = matchingRows[0].product_id;
            data = matchingRows.filter(r => r.product_id === targetProdId);
          }
        }
      }
    }

    if (!data || data.length === 0) {
      console.warn(`[ArbitrageCalculator] No active arbitrage data found for product "${productNameOrId}".`);
      return null;
    }

    const first = data[0];
    const domesticPriceTry = parseFloat(first.domestic_price_try);

    // 2. Map and score each abroad country opportunity
    const opportunities: ArbitrageOpportunity[] = data
      .map((row: any) => {
        const netSavingsTry = parseFloat(row.net_savings_try) || 0;
        const netAbroadCost = parseFloat(row.net_abroad_cost_try) || 0;
        const originalPrice = parseFloat(row.abroad_price_original) || 0;
        const convertedTry = parseFloat(row.abroad_price_try) || 0;
        const vatRefundTry = parseFloat(row.vat_refund_try) || 0;
        const vatRefundPct = parseFloat(row.vat_refund_pct) || 0;
        const imeiFee = parseFloat(row.imei_fee_try) || 0;
        const savingsPct = domesticPriceTry > 0 ? (netSavingsTry / domesticPriceTry) * 100 : 0;

        // Arbitrage viability classification
        let rating: ArbitrageOpportunity['arbitrageRating'] = 'NOT_WORTH_IT';
        let verdict = 'Almaya Değmez (Fiyat Farkı Yetersiz)';

        if (netSavingsTry >= 15000) {
          rating = 'EXCELLENT_FREE_VACATION';
          verdict = `Mükemmel Fırsat! ${netSavingsTry.toLocaleString('tr-TR')} ₺ kâr (Uçak bileti ve otel masrafını tamamen çıkartır).`;
        } else if (netSavingsTry >= 6000) {
          rating = 'GREAT_SAVINGS';
          verdict = `Çok Karlı! ${netSavingsTry.toLocaleString('tr-TR')} ₺ net kazanç.`;
        } else if (netSavingsTry > 1500) {
          rating = 'MODERATE';
          verdict = `Orta Düzey Tasarruf (${netSavingsTry.toLocaleString('tr-TR')} ₺). Yolculuk esnasında alınabilir.`;
        }

        return {
          rank: 0,
          countryCode: row.abroad_country_code || 'N/A',
          countryName: row.abroad_city || row.abroad_country_code || 'Yurtdışı',
          cityName: row.abroad_city || '',
          retailerName: row.abroad_retailer || 'Mağaza',
          originalPrice,
          currencyCode: row.abroad_currency || 'USD',
          convertedPriceTry: convertedTry,
          vatRefundPct,
          vatRefundTry,
          customsFeesTry: imeiFee,
          netAbroadLandedCostTry: netAbroadCost,
          netSavingsTry,
          savingsPercentage: parseFloat(savingsPct.toFixed(1)),
          arbitrageRating: rating,
          verdictTurkish: verdict
        };
      })
      // Sort from highest profit (en karlı) to lowest
      .sort((a: any, b: any) => b.netSavingsTry - a.netSavingsTry)
      .map((item: any, index: number) => ({
        ...item,
        rank: index + 1
      }));

    return {
      productId: first.product_id,
      brand: first.brand,
      modelName: first.model_name,
      categoryName: first.category_name,
      domesticRetailer: first.domestic_retailer,
      domesticPriceTry,
      bestOpportunity: opportunities[0],
      allOpportunities: opportunities
    };
  }
}
