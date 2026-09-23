import { Destination, TravelStyle } from '../types';
import { ExchangeRateService } from './exchangeRateService';

export interface LivingCostBreakdown {
  dailyFoodTry: number;
  dailyTransportTry: number;
  dailyEntertainmentTry: number;
  dailyBufferTry: number;
  totalDailyTry: number;
  details: {
    diningDescription: string;
    transitDescription: string;
    entertainmentDescription: string;
  };
}

export class LivingCostService {
  private fxService = ExchangeRateService.getInstance();

  /**
   * Calculates estimated daily food, transport, entertainment, and leisure expenses in TRY
   */
  public async calculateDailyLivingCost(
    destination: Destination,
    style: TravelStyle
  ): Promise<LivingCostBreakdown> {
    let localDailyTotal = destination.dailyCostModerate;

    let diningPct = 0.45;
    let transitPct = 0.20;
    let entertainmentPct = 0.25;
    let bufferPct = 0.10;

    let diningDesc = 'Orta segment popüler restoranlar ve yerel lezzet durakları';
    let transitDesc = 'Şehir içi günlük metro/otobüs bileti + taksi';
    let entertainmentDesc = 'Müze girişleri, seyir terasları ve tarihi şehir turları';

    if (style === 'budget') {
      localDailyTotal = destination.dailyCostBudget;
      diningDesc = 'Sokak lezzetleri, ekonomik kafeler ve yerel fırınlar';
      transitDesc = 'Sınırsız toplu taşıma kartı (metro/tramvay)';
      entertainmentDesc = 'Şehir parkları, ücretsiz müzeler ve yürüyüş rotaları';
    } else if (style === 'luxury') {
      localDailyTotal = destination.dailyCostLuxury;
      diningDesc = 'Fine dining, Michelin rehberi restoranlar ve gurme akşam yemekleri';
      transitDesc = 'Özel havalimanı transferi ve VIP taksi';
      entertainmentDesc = 'Hızlı geçişli VIP müze biletleri, gece şovları ve seçkin etkinlikler';
    }

    const totalDailyTry = await this.fxService.convertToTRY(
      localDailyTotal,
      destination.currencyCode
    );

    const dailyFoodTry = Math.round(totalDailyTry * diningPct);
    const dailyTransportTry = Math.round(totalDailyTry * transitPct);
    const dailyEntertainmentTry = Math.round(totalDailyTry * entertainmentPct);
    const dailyBufferTry = Math.round(totalDailyTry - dailyFoodTry - dailyTransportTry - dailyEntertainmentTry);

    return {
      dailyFoodTry,
      dailyTransportTry,
      dailyEntertainmentTry,
      dailyBufferTry,
      totalDailyTry,
      details: {
        diningDescription: diningDesc,
        transitDescription: transitDesc,
        entertainmentDescription: entertainmentDesc,
      },
    };
  }

  /**
   * Calculates hotel cost per night and total for N nights in TRY
   */
  public async calculateHotelCost(
    destination: Destination,
    nights: number,
    style: TravelStyle
  ): Promise<{
    nightlyRateLocal: number;
    nightlyRateTry: number;
    totalHotelTry: number;
    currency: string;
    tierDescription: string;
  }> {
    let nightlyRateLocal = destination.avgHotelModerate;
    let tierDescription = '3-4 Yıldızlı Merkezi Butik Otel';

    if (style === 'budget') {
      nightlyRateLocal = destination.avgHotelBudget;
      tierDescription = 'Tasarım Hostel / Özel Banyolu Butik Oda';
    } else if (style === 'luxury') {
      nightlyRateLocal = destination.avgHotelLuxury;
      tierDescription = '5 Yıldızlı Lüks Executive & Resort Otel';
    }

    const nightlyRateTry = await this.fxService.convertToTRY(
      nightlyRateLocal,
      destination.currencyCode
    );

    const totalHotelTry = Math.round(nightlyRateTry * nights);

    return {
      nightlyRateLocal,
      nightlyRateTry,
      totalHotelTry,
      currency: destination.currencyCode,
      tierDescription,
    };
  }
}
