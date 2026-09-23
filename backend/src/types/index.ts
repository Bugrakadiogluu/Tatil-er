export type TravelStyle = 'budget' | 'moderate' | 'luxury';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
}

export interface FxRateMap {
  [currencyCode: string]: number; // Multiplier to get TRY: e.g. USD -> 35.80
}

export interface Destination {
  id: string;
  cityName: string;
  countryName: string;
  countryCode: string;
  primaryAirportCode: string;
  secondaryAirports: string[];
  currencyCode: string;
  flightDurationHours: number;
  dailyCostBudget: number; // in local currency
  dailyCostModerate: number;
  dailyCostLuxury: number;
  avgHotelBudget: number; // per night in local currency
  avgHotelModerate: number;
  avgHotelLuxury: number;
  imageUrl: string;
}

export interface TravelQuoteRequest {
  originAirport: string; // e.g., 'IST' or 'SAW'
  destinationAirport: string; // e.g., 'NRT', 'BER', 'DXB'
  departureDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  durationDays: number;
  travelStyle: TravelStyle;
}

export interface TravelQuoteResponse {
  originAirport: string;
  destinationAirport: string;
  destinationCity: string;
  destinationCountry: string;
  destinationCountryCode: string;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  travelStyle: TravelStyle;
  flightPriceTry: number;
  hotelPriceTry: number;
  dailyLivingExpensesTry: number;
  totalTravelCostTry: number;
  isAmadeusLiveRate: boolean;
  flightDeepLink?: string;
  hotelDeepLink?: string;
  googleFlightsLink?: string;
  featuredHotels?: any[];
  totalHotelsInDestination?: number;
  breakdown: {
    flight: {
      airline: string;
      outboundRoute: string;
      inboundRoute: string;
      priceInTry: number;
    };
    hotel: {
      nights: number;
      nightlyRateLocal: number;
      nightlyRateTry: number;
      currency: string;
      tierDescription: string;
      totalHotelTry: number;
    };
    living: {
      dailyFoodTry: number;
      dailyTransportTry: number;
      dailyEntertainmentTry: number;
      dailyBufferTry: number;
      totalDailyTry: number;
      totalPeriodLivingTry: number;
      details?: {
        diningDescription: string;
        transitDescription: string;
        entertainmentDescription: string;
      };
    };
  };
}

export interface VATRefundRule {
  countryCode: string;
  countryName: string;
  standardVatRate: number; // e.g. 19%
  minSpendAmount: number;
  netRefundPctMin: number;
  netRefundPctMax: number;
  refundOperator: string;
  hasTouristVatRefund: boolean;
  refundProcessType: 'instant_shop_deduction' | 'airport_customs_stamp' | 'digital_validation';
  notes: string;
}

export interface CustomsRule {
  targetCountryCode: string;
  categoryCode: string;
  personalAllowanceQty: number;
  imeiFeeTry: number;
  trtBandrolFeeEur: number;
  requiresImeiRegistration: boolean;
  passengerQuotaRule: string;
  notes: string;
  effectiveYear: number;
}

export interface ProductPrice {
  retailerName: string;
  countryCode: string;
  currencyCode: string;
  priceOriginal: number;
  priceTryConverted: number;
  isDomestic: boolean;
  inStock: boolean;
  productUrl: string;
  lastScrapedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  brand: string;
  modelName: string;
  globalSku: string;
  specs: Record<string, any>;
  imageUrl: string;
  weightKg: number;
  domesticPriceTry: number;
  abroadPrices: ProductPrice[];
}

export interface SingleProductArbitrage {
  productId: string;
  brand: string;
  modelName: string;
  categoryCode: string;
  categoryName: string;
  imageUrl: string;
  domesticRetailer: string;
  domesticPriceTry: number;
  abroadRetailer: string;
  abroadCountryCode: string;
  abroadCity: string;
  abroadPriceOriginal: number;
  abroadCurrency: string;
  abroadPriceTry: number;
  vatRefundRatePct: number;
  vatRefundAmountTry: number;
  imeiFeeTry: number;
  trtBandrolFeeTry: number;
  netLandedCostAbroadTry: number;
  netSavingsTry: number;
  savingsPercentage: number;
  customsAlert?: string;
  taxRefundMethod: string;
}

export interface BasketItemInput {
  productId: string;
  destinationAirport?: string;
  quantity?: number;
}

export interface BasketArbitrageCalculation {
  destinationAirport: string;
  destinationCity: string;
  destinationCountry: string;
  travelCost: TravelQuoteResponse;
  items: (SingleProductArbitrage & { quantity: number; subtotalNetSavingsTry: number })[];
  summary: {
    totalDomesticCostTry: number;
    totalAbroadLandedCostTry: number;
    totalGrossSavingsTry: number;
    totalTravelCostTry: number;
    netArbitrageProfitTry: number; // totalGrossSavingsTry - totalTravelCostTry
    tripFundedPercentage: number; // (totalGrossSavingsTry / totalTravelCostTry) * 100
    isTripFree: boolean;
    remainingProfitOrDeficitTry: number;
  };
}

export interface ReverseArbitrageDeal {
  destination: Destination;
  product: Product;
  arbitrage: SingleProductArbitrage;
  travelEstimate: TravelQuoteResponse;
  fundingPercentage: number;
  isTripFree: boolean;
  netSurplusTry: number;
  maxFreeDays: number;
  maxFreeDaysBudget: number;
  maxFreeDaysModerate: number;
  maxFreeDaysLuxury: number;
  dailyCostBudgetTry: number;
  dailyCostModerateTry: number;
  dailyCostLuxuryTry: number;
  remainingPocketMoneyBudgetTry: number;
  remainingPocketMoneyModerateTry: number;
  remainingPocketMoneyLuxuryTry: number;
  remainingPocketMoneyTry: number;
  dealVerdict: string;
  dailyStayCostTry: number;
  savingsAfterFlightTry: number;
}

