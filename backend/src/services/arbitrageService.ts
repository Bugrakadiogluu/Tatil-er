import { getSupabaseClient } from '../config/supabase';
import {
  BasketArbitrageCalculation,
  BasketItemInput,
  Destination,
  ReverseArbitrageDeal,
  SingleProductArbitrage,
  TravelQuoteRequest,
  TravelQuoteResponse,
} from '../types';
import { AmadeusService } from './amadeusService';
import { HotelService } from './hotelService';
import { LivingCostService } from './livingCostService';
import { ProductService } from './productService';
import { TaxCustomsService } from './taxCustomsService';

export class ArbitrageService {
  private productService = new ProductService();
  private taxCustomsService = new TaxCustomsService();
  private amadeusService = AmadeusService.getInstance();
  private livingCostService = new LivingCostService();

  // Master Global Hubs matching every scraped retailer country
  private static GLOBAL_RETAILER_DESTINATIONS: Destination[] = [
    {
      id: 'dest-jp-tokyo',
      cityName: 'Tokyo',
      countryName: 'Japan',
      countryCode: 'JP',
      primaryAirportCode: 'NRT',
      secondaryAirports: ['HND'],
      currencyCode: 'JPY',
      flightDurationHours: 11.5,
      dailyCostBudget: 6500,
      dailyCostModerate: 14000,
      dailyCostLuxury: 32000,
      avgHotelBudget: 12000,
      avgHotelModerate: 22000,
      avgHotelLuxury: 55000,
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-de-berlin',
      cityName: 'Berlin',
      countryName: 'Germany',
      countryCode: 'DE',
      primaryAirportCode: 'BER',
      secondaryAirports: ['FRA', 'MUC'],
      currencyCode: 'EUR',
      flightDurationHours: 3.5,
      dailyCostBudget: 45,
      dailyCostModerate: 110,
      dailyCostLuxury: 260,
      avgHotelBudget: 75,
      avgHotelModerate: 145,
      avgHotelLuxury: 340,
      imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-ae-dubai',
      cityName: 'Dubai',
      countryName: 'United Arab Emirates',
      countryCode: 'AE',
      primaryAirportCode: 'DXB',
      secondaryAirports: ['DWC', 'AUH'],
      currencyCode: 'AED',
      flightDurationHours: 4.5,
      dailyCostBudget: 180,
      dailyCostModerate: 420,
      dailyCostLuxury: 1100,
      avgHotelBudget: 280,
      avgHotelModerate: 550,
      avgHotelLuxury: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-gb-london',
      cityName: 'London',
      countryName: 'United Kingdom',
      countryCode: 'GB',
      primaryAirportCode: 'LHR',
      secondaryAirports: ['LGW', 'STN'],
      currencyCode: 'GBP',
      flightDurationHours: 4.0,
      dailyCostBudget: 55,
      dailyCostModerate: 135,
      dailyCostLuxury: 340,
      avgHotelBudget: 90,
      avgHotelModerate: 185,
      avgHotelLuxury: 450,
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-us-nyc',
      cityName: 'New York',
      countryName: 'United States',
      countryCode: 'US',
      primaryAirportCode: 'JFK',
      secondaryAirports: ['EWR', 'LGA'],
      currencyCode: 'USD',
      flightDurationHours: 10.5,
      dailyCostBudget: 85,
      dailyCostModerate: 190,
      dailyCostLuxury: 480,
      avgHotelBudget: 140,
      avgHotelModerate: 260,
      avgHotelLuxury: 650,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-ge-tbilisi',
      cityName: 'Tbilisi',
      countryName: 'Georgia',
      countryCode: 'GE',
      primaryAirportCode: 'TBS',
      secondaryAirports: ['BUS'],
      currencyCode: 'GEL',
      flightDurationHours: 2.2,
      dailyCostBudget: 60,
      dailyCostModerate: 140,
      dailyCostLuxury: 320,
      avgHotelBudget: 80,
      avgHotelModerate: 180,
      avgHotelLuxury: 420,
      imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-es-madrid',
      cityName: 'Madrid',
      countryName: 'Spain',
      countryCode: 'ES',
      primaryAirportCode: 'MAD',
      secondaryAirports: ['BCN'],
      currencyCode: 'EUR',
      flightDurationHours: 4.5,
      dailyCostBudget: 40,
      dailyCostModerate: 95,
      dailyCostLuxury: 230,
      avgHotelBudget: 65,
      avgHotelModerate: 130,
      avgHotelLuxury: 310,
      imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-it-rome',
      cityName: 'Rome',
      countryName: 'Italy',
      countryCode: 'IT',
      primaryAirportCode: 'FCO',
      secondaryAirports: ['MXP', 'CIA'],
      currencyCode: 'EUR',
      flightDurationHours: 2.5,
      dailyCostBudget: 45,
      dailyCostModerate: 105,
      dailyCostLuxury: 250,
      avgHotelBudget: 75,
      avgHotelModerate: 140,
      avgHotelLuxury: 350,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-nl-ams',
      cityName: 'Amsterdam',
      countryName: 'Netherlands',
      countryCode: 'NL',
      primaryAirportCode: 'AMS',
      secondaryAirports: ['EIN'],
      currencyCode: 'EUR',
      flightDurationHours: 3.5,
      dailyCostBudget: 50,
      dailyCostModerate: 115,
      dailyCostLuxury: 280,
      avgHotelBudget: 85,
      avgHotelModerate: 160,
      avgHotelLuxury: 380,
      imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-sa-riyadh',
      cityName: 'Riyadh',
      countryName: 'Saudi Arabia',
      countryCode: 'SA',
      primaryAirportCode: 'RUH',
      secondaryAirports: ['JED'],
      currencyCode: 'SAR',
      flightDurationHours: 4.0,
      dailyCostBudget: 150,
      dailyCostModerate: 360,
      dailyCostLuxury: 950,
      avgHotelBudget: 240,
      avgHotelModerate: 480,
      avgHotelLuxury: 1400,
      imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-sg-singapore',
      cityName: 'Singapore',
      countryName: 'Singapore',
      countryCode: 'SG',
      primaryAirportCode: 'SIN',
      secondaryAirports: [],
      currencyCode: 'SGD',
      flightDurationHours: 10.5,
      dailyCostBudget: 60,
      dailyCostModerate: 140,
      dailyCostLuxury: 350,
      avgHotelBudget: 90,
      avgHotelModerate: 190,
      avgHotelLuxury: 480,
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-ca-toronto',
      cityName: 'Toronto',
      countryName: 'Canada',
      countryCode: 'CA',
      primaryAirportCode: 'YYZ',
      secondaryAirports: ['YUL'],
      currencyCode: 'CAD',
      flightDurationHours: 10.5,
      dailyCostBudget: 65,
      dailyCostModerate: 145,
      dailyCostLuxury: 360,
      avgHotelBudget: 110,
      avgHotelModerate: 210,
      avgHotelLuxury: 520,
      imageUrl: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-se-stockholm',
      cityName: 'Stockholm',
      countryName: 'Sweden',
      countryCode: 'SE',
      primaryAirportCode: 'ARN',
      secondaryAirports: ['BMA'],
      currencyCode: 'SEK',
      flightDurationHours: 3.5,
      dailyCostBudget: 480,
      dailyCostModerate: 1100,
      dailyCostLuxury: 2600,
      avgHotelBudget: 750,
      avgHotelModerate: 1500,
      avgHotelLuxury: 3600,
      imageUrl: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-pl-warsaw',
      cityName: 'Warsaw',
      countryName: 'Poland',
      countryCode: 'PL',
      primaryAirportCode: 'WAW',
      secondaryAirports: ['KRK'],
      currencyCode: 'PLN',
      flightDurationHours: 2.5,
      dailyCostBudget: 140,
      dailyCostModerate: 320,
      dailyCostLuxury: 780,
      avgHotelBudget: 190,
      avgHotelModerate: 390,
      avgHotelLuxury: 950,
      imageUrl: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-be-brussels',
      cityName: 'Brussels',
      countryName: 'Belgium',
      countryCode: 'BE',
      primaryAirportCode: 'BRU',
      secondaryAirports: ['CRL'],
      currencyCode: 'EUR',
      flightDurationHours: 3.5,
      dailyCostBudget: 45,
      dailyCostModerate: 105,
      dailyCostLuxury: 250,
      avgHotelBudget: 75,
      avgHotelModerate: 145,
      avgHotelLuxury: 340,
      imageUrl: 'https://images.unsplash.com/photo-1559113513-d5e09c78b9dd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-eg-cairo',
      cityName: 'Cairo',
      countryName: 'Egypt',
      countryCode: 'EG',
      primaryAirportCode: 'CAI',
      secondaryAirports: ['SPX'],
      currencyCode: 'EGP',
      flightDurationHours: 2.2,
      dailyCostBudget: 1200,
      dailyCostModerate: 2500,
      dailyCostLuxury: 6000,
      avgHotelBudget: 1500,
      avgHotelModerate: 3200,
      avgHotelLuxury: 8500,
      imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-mx-mexicocity',
      cityName: 'Mexico City',
      countryName: 'Mexico',
      countryCode: 'MX',
      primaryAirportCode: 'MEX',
      secondaryAirports: ['NLU'],
      currencyCode: 'MXN',
      flightDurationHours: 14.5,
      dailyCostBudget: 750,
      dailyCostModerate: 1800,
      dailyCostLuxury: 4500,
      avgHotelBudget: 1100,
      avgHotelModerate: 2400,
      avgHotelLuxury: 6200,
      imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-br-saopaulo',
      cityName: 'Sao Paulo',
      countryName: 'Brazil',
      countryCode: 'BR',
      primaryAirportCode: 'GRU',
      secondaryAirports: ['CGH', 'VCP'],
      currencyCode: 'BRL',
      flightDurationHours: 13.5,
      dailyCostBudget: 220,
      dailyCostModerate: 550,
      dailyCostLuxury: 1400,
      avgHotelBudget: 320,
      avgHotelModerate: 680,
      avgHotelLuxury: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-in-mumbai',
      cityName: 'Mumbai',
      countryName: 'India',
      countryCode: 'IN',
      primaryAirportCode: 'BOM',
      secondaryAirports: ['DEL'],
      currencyCode: 'INR',
      flightDurationHours: 6.5,
      dailyCostBudget: 3200,
      dailyCostModerate: 7500,
      dailyCostLuxury: 19000,
      avgHotelBudget: 4500,
      avgHotelModerate: 9500,
      avgHotelLuxury: 26000,
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dest-za-johannesburg',
      cityName: 'Johannesburg',
      countryName: 'South Africa',
      countryCode: 'ZA',
      primaryAirportCode: 'JNB',
      secondaryAirports: ['CPT'],
      currencyCode: 'ZAR',
      flightDurationHours: 9.5,
      dailyCostBudget: 650,
      dailyCostModerate: 1500,
      dailyCostLuxury: 3800,
      avgHotelBudget: 950,
      avgHotelModerate: 2100,
      avgHotelLuxury: 5500,
      imageUrl: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  public async getAllDestinations(): Promise<Destination[]> {
    const supabase = getSupabaseClient();
    let dbDestinations: Destination[] = [];

    if (supabase) {
      try {
        const { data, error } = await supabase.from('destinations').select('*').eq('is_active', true);
        if (!error && data && data.length > 0) {
          dbDestinations = data.map((d: any) => ({
            id: d.id,
            cityName: d.city_name,
            countryName: d.country_name,
            countryCode: d.country_code,
            primaryAirportCode: d.primary_airport_code,
            secondaryAirports: d.secondary_airports || [],
            currencyCode: d.currency_code,
            flightDurationHours: parseFloat(d.flight_duration_hours || '4.0'),
            dailyCostBudget: parseFloat(d.daily_cost_budget),
            dailyCostModerate: parseFloat(d.daily_cost_moderate),
            dailyCostLuxury: parseFloat(d.daily_cost_luxury),
            avgHotelBudget: parseFloat(d.avg_hotel_budget),
            avgHotelModerate: parseFloat(d.avg_hotel_moderate),
            avgHotelLuxury: parseFloat(d.avg_hotel_luxury),
            imageUrl: d.image_url || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
          }));
        }
      } catch (err: any) {
        console.warn('[Supabase Destinations] Query error:', err.message);
      }
    }

    // Merge Supabase destinations with master global retailer hubs (preventing duplicates)
    const combined = [...dbDestinations];
    for (const master of ArbitrageService.GLOBAL_RETAILER_DESTINATIONS) {
      if (!combined.some((d) => d.primaryAirportCode.toUpperCase() === master.primaryAirportCode.toUpperCase())) {
        combined.push(master);
      }
    }

    return combined;
  }

  public async getDestinationByAirport(airportCode: string): Promise<Destination | null> {
    const dests = await this.getAllDestinations();
    const code = airportCode.toUpperCase();
    return (
      dests.find(
        (d) =>
          d.primaryAirportCode.toUpperCase() === code ||
          d.secondaryAirports.some((a) => a.toUpperCase() === code)
      ) || null
    );
  }

  /**
   * Generates a complete travel quote (Flight + Hotel + Food + Transit + Entertainment)
   * Dynamically scales living, hotel, transit, and food expenses according to any duration (from 1 day up to 1 month / 75 days)
   */
  public async getTravelQuote(req: TravelQuoteRequest): Promise<TravelQuoteResponse> {
    const dest = await this.getDestinationByAirport(req.destinationAirport);
    if (!dest) {
      throw new Error(`Destination airport ${req.destinationAirport} not found`);
    }

    // Dynamic vacation duration calculation: if departure & return dates are passed, compute exact days
    let durationDays = req.durationDays;
    if (req.departureDate && req.returnDate) {
      const d1 = new Date(req.departureDate);
      const d2 = new Date(req.returnDate);
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime()) && d2.getTime() > d1.getTime()) {
        durationDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
      }
    }
    if (!durationDays || durationDays < 1) durationDays = 4;

    const hotelNights = Math.max(1, durationDays - 1);
    const travelStyle = req.travelStyle || 'moderate';

    // 1. Flight quote (Skyscanner RapidAPI / Amadeus)
    const flight = await this.amadeusService.searchFlightOffers(
      req.originAirport || 'IST',
      dest.primaryAirportCode,
      req.departureDate,
      req.returnDate
    );

    // 2. Hotel quote
    const hotel = await this.livingCostService.calculateHotelCost(
      dest,
      hotelNights,
      travelStyle
    );

    // 3. Living expenses quote (Food + Transit + Entertainment)
    const living = await this.livingCostService.calculateDailyLivingCost(
      dest,
      travelStyle
    );
    const totalPeriodLivingTry = living.totalDailyTry * durationDays;

    const totalTravelCostTry = flight.priceInTry + hotel.totalHotelTry + totalPeriodLivingTry;

    // 4. Outbound deep-links and featured hotels
    const hotelService = new HotelService();
    const flightDeepLink = `https://www.skyscanner.com/transport/flights/${(req.originAirport || 'ist').toLowerCase()}/${dest.primaryAirportCode.toLowerCase()}/${req.departureDate.replace(/-/g, '').slice(2)}/${req.returnDate.replace(/-/g, '').slice(2)}/?adultsv2=1&cabinclass=economy`;
    const googleFlightsLink = `https://www.google.com/travel/flights?q=Flights%20to%20${dest.primaryAirportCode}%20from%20${req.originAirport || 'IST'}%20on%20${req.departureDate}%20through%20${req.returnDate}`;
    const hotelDeepLink = hotelService.generateBookingComUrl(dest.cityName, req.departureDate, req.returnDate);
    const featuredHotels = await hotelService.getFeaturedHotels(dest, req.departureDate, req.returnDate);
    const totalHotelsInDestination = hotelService.getTotalPropertiesEstimate(dest.cityName);

    return {
      originAirport: req.originAirport || 'IST',
      destinationAirport: dest.primaryAirportCode,
      destinationCity: dest.cityName,
      destinationCountry: dest.countryName,
      destinationCountryCode: dest.countryCode,
      departureDate: req.departureDate,
      returnDate: req.returnDate,
      durationDays,
      travelStyle,
      flightPriceTry: flight.priceInTry,
      hotelPriceTry: hotel.totalHotelTry,
      dailyLivingExpensesTry: totalPeriodLivingTry,
      totalTravelCostTry,
      isAmadeusLiveRate: flight.isLive,
      flightDeepLink,
      hotelDeepLink,
      googleFlightsLink,
      featuredHotels,
      totalHotelsInDestination,
      breakdown: {
        flight: {
          airline: flight.airline,
          outboundRoute: flight.outboundRoute,
          inboundRoute: flight.inboundRoute,
          priceInTry: flight.priceInTry,
        },
        hotel: {
          nights: hotelNights,
          nightlyRateLocal: hotel.nightlyRateLocal,
          nightlyRateTry: hotel.nightlyRateTry,
          currency: hotel.currency,
          tierDescription: hotel.tierDescription,
          totalHotelTry: hotel.totalHotelTry,
        },
        living: {
          dailyFoodTry: living.dailyFoodTry,
          dailyTransportTry: living.dailyTransportTry,
          dailyEntertainmentTry: living.dailyEntertainmentTry,
          dailyBufferTry: living.dailyBufferTry,
          totalDailyTry: living.totalDailyTry,
          totalPeriodLivingTry,
          details: living.details,
        },
      },
    };
  }

  /**
   * Computes single product arbitrage for a given destination airport
   */
  public async calculateSingleProductArbitrage(
    productId: string,
    destinationAirport: string
  ): Promise<SingleProductArbitrage> {
    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const dest = await this.getDestinationByAirport(destinationAirport);
    if (!dest) {
      throw new Error(`Destination ${destinationAirport} not found`);
    }

    // Match retailer in the destination country, or take first available
    let foreignPrice = product.abroadPrices.find(
      (p) => p.countryCode.toUpperCase() === dest.countryCode.toUpperCase()
    );

    if (!foreignPrice && product.abroadPrices.length > 0) {
      foreignPrice = product.abroadPrices[0];
    }

    if (!foreignPrice) {
      throw new Error(`No abroad pricing found for product ${product.modelName}`);
    }

    // Compute taxes, tax-free refund, and Turkish customs
    const taxCustoms = await this.taxCustomsService.computeTaxesAndCustoms(
      dest.countryCode,
      product.categoryCode,
      foreignPrice.priceOriginal,
      foreignPrice.currencyCode,
      foreignPrice.priceTryConverted
    );

    // Calculation formulas
    const netLandedCostAbroadTry = Math.round(
      (foreignPrice.priceTryConverted - taxCustoms.vatRefundAmountTry + taxCustoms.totalCustomsDutiesTry) * 100
    ) / 100;

    const netSavingsTry = Math.round((product.domesticPriceTry - netLandedCostAbroadTry) * 100) / 100;
    const savingsPercentage =
      Math.round(((netSavingsTry / product.domesticPriceTry) * 100) * 10) / 10;

    return {
      productId: product.id,
      brand: product.brand,
      modelName: product.modelName,
      categoryCode: product.categoryCode,
      categoryName: product.categoryName,
      imageUrl: product.imageUrl,
      domesticRetailer: 'Apple TR / Vatan / Hepsiburada',
      domesticPriceTry: product.domesticPriceTry,
      abroadRetailer: foreignPrice.retailerName,
      abroadCountryCode: dest.countryCode,
      abroadCity: dest.cityName,
      abroadPriceOriginal: foreignPrice.priceOriginal,
      abroadCurrency: foreignPrice.currencyCode,
      abroadPriceTry: foreignPrice.priceTryConverted,
      vatRefundRatePct: taxCustoms.vatRefundPct,
      vatRefundAmountTry: taxCustoms.vatRefundAmountTry,
      imeiFeeTry: taxCustoms.imeiFeeTry,
      trtBandrolFeeTry: taxCustoms.trtBandrolFeeTry,
      netLandedCostAbroadTry,
      netSavingsTry,
      savingsPercentage,
      customsAlert: taxCustoms.customsAlert,
      taxRefundMethod: taxCustoms.taxRefundMethod,
    };
  }

  /**
   * Calculates the full multi-product shopping basket arbitrage offset against travel costs
   */
  public async calculateBasketArbitrage(
    travelReq: TravelQuoteRequest,
    items: BasketItemInput[]
  ): Promise<BasketArbitrageCalculation> {
    const travelCost = await this.getTravelQuote(travelReq);

    if (!items || items.length === 0) {
      return {
        destinationAirport: travelCost.destinationAirport,
        destinationCity: travelCost.destinationCity,
        destinationCountry: travelCost.destinationCountry,
        travelCost,
        items: [],
        summary: {
          totalDomesticCostTry: 0,
          totalAbroadLandedCostTry: 0,
          totalGrossSavingsTry: 0,
          totalTravelCostTry: travelCost.totalTravelCostTry,
          netArbitrageProfitTry: -travelCost.totalTravelCostTry,
          tripFundedPercentage: 0,
          isTripFree: false,
          remainingProfitOrDeficitTry: -travelCost.totalTravelCostTry,
        },
      };
    }

    let totalDomesticCostTry = 0;
    let totalAbroadLandedCostTry = 0;
    let totalGrossSavingsTry = 0;
    let totalSmartphones = 0;

    const rawProcessed = await Promise.all(
      items.map(async (item) => {
        try {
          const qty = item.quantity || 1;
          const single = await this.calculateSingleProductArbitrage(
            item.productId,
            travelReq.destinationAirport
          );

          if (single.categoryCode === 'smartphones') {
            totalSmartphones += qty;
          }

          const subtotalDomestic = single.domesticPriceTry * qty;
          const subtotalAbroadLanded = single.netLandedCostAbroadTry * qty;
          const subtotalNetSavingsTry = single.netSavingsTry * qty;

          totalDomesticCostTry += subtotalDomestic;
          totalAbroadLandedCostTry += subtotalAbroadLanded;
          totalGrossSavingsTry += subtotalNetSavingsTry;

          return {
            ...single,
            quantity: qty,
            subtotalNetSavingsTry,
          };
        } catch (err: any) {
          console.warn(`[Basket] Notice: Product ${item.productId} skipped (${err.message})`);
          return null;
        }
      })
    );

    const processedItems = rawProcessed.filter(Boolean) as any[];

    // Turkish customs quota check
    if (totalSmartphones > 1) {
      processedItems.forEach((it) => {
        if (it.categoryCode === 'smartphones') {
          it.customsAlert = `⚠️ STRICT CUSTOMS WARNING: You have ${totalSmartphones} smartphones in your basket. Turkish regulations permit only 1 smartphone per passenger every 3 calendar years! Additional phones will be confiscated or taxed at 100%+ commercial rates at customs.`;
        }
      });
    }

    const netArbitrageProfitTry = Math.round((totalGrossSavingsTry - travelCost.totalTravelCostTry) * 100) / 100;
    const tripFundedPercentage =
      travelCost.totalTravelCostTry > 0
        ? Math.round((totalGrossSavingsTry / travelCost.totalTravelCostTry) * 100)
        : 0;

    const isTripFree = netArbitrageProfitTry >= 0;

    return {
      destinationAirport: travelCost.destinationAirport,
      destinationCity: travelCost.destinationCity,
      destinationCountry: travelCost.destinationCountry,
      travelCost,
      items: processedItems,
      summary: {
        totalDomesticCostTry: Math.round(totalDomesticCostTry * 100) / 100,
        totalAbroadLandedCostTry: Math.round(totalAbroadLandedCostTry * 100) / 100,
        totalGrossSavingsTry: Math.round(totalGrossSavingsTry * 100) / 100,
        totalTravelCostTry: travelCost.totalTravelCostTry,
        netArbitrageProfitTry,
        tripFundedPercentage,
        isTripFree,
        remainingProfitOrDeficitTry: netArbitrageProfitTry,
      },
    };
  }

  /**
   * Reverse Arbitrage Engine: "Fund My Trip"
   */
  public async findReverseArbitrageDeals(productId: string): Promise<ReverseArbitrageDeal[]> {
    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const destinations = await this.getAllDestinations();
    const deals: ReverseArbitrageDeal[] = [];

    const today = new Date();
    const departure = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const returnD = new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000);
    const depStr = departure.toISOString().split('T')[0];
    const retStr = returnD.toISOString().split('T')[0];

    const dealPromises = destinations.map(async (dest) => {
      try {
        const arbitrage = await this.calculateSingleProductArbitrage(
          productId,
          dest.primaryAirportCode
        );

        const travelEstimate = await this.getTravelQuote({
          originAirport: 'IST',
          destinationAirport: dest.primaryAirportCode,
          departureDate: depStr,
          returnDate: retStr,
          durationDays: 4,
          travelStyle: 'budget',
        });

        const netSurplusTry = Math.round(
          (arbitrage.netSavingsTry - travelEstimate.totalTravelCostTry) * 100
        ) / 100;
        const fundingPercentage =
          travelEstimate.totalTravelCostTry > 0
            ? Math.round((arbitrage.netSavingsTry / travelEstimate.totalTravelCostTry) * 100)
            : 0;

        const flightPriceTry = travelEstimate.flightPriceTry || 0;
        const savingsAfterFlightTry = Math.round((arbitrage.netSavingsTry - flightPriceTry) * 100) / 100;

        // Compute 3 Comfort Tiers: Ekonomik (Budget), Normal/Standart (Moderate), Lüks (Luxury)
        const [budgetLiving, budgetHotel, moderateLiving, moderateHotel, luxuryLiving, luxuryHotel] =
          await Promise.all([
            this.livingCostService.calculateDailyLivingCost(dest, 'budget'),
            this.livingCostService.calculateHotelCost(dest, 1, 'budget'),
            this.livingCostService.calculateDailyLivingCost(dest, 'moderate'),
            this.livingCostService.calculateHotelCost(dest, 1, 'moderate'),
            this.livingCostService.calculateDailyLivingCost(dest, 'luxury'),
            this.livingCostService.calculateHotelCost(dest, 1, 'luxury'),
          ]);

        const dailyCostBudgetTry = Math.max(800, Math.round(budgetLiving.totalDailyTry + budgetHotel.nightlyRateTry));
        const dailyCostModerateTry = Math.max(1200, Math.round(moderateLiving.totalDailyTry + moderateHotel.nightlyRateTry));
        const dailyCostLuxuryTry = Math.max(2500, Math.round(luxuryLiving.totalDailyTry + luxuryHotel.nightlyRateTry));

        let maxFreeDaysBudget = 0;
        let maxFreeDaysModerate = 0;
        let maxFreeDaysLuxury = 0;
        let remainingPocketMoneyBudgetTry = 0;
        let remainingPocketMoneyModerateTry = 0;
        let remainingPocketMoneyLuxuryTry = 0;
        let dealVerdict = '';

        if (savingsAfterFlightTry > 0) {
          maxFreeDaysBudget = Math.floor(savingsAfterFlightTry / dailyCostBudgetTry);
          remainingPocketMoneyBudgetTry = Math.round((savingsAfterFlightTry - maxFreeDaysBudget * dailyCostBudgetTry) * 100) / 100;

          maxFreeDaysModerate = Math.floor(savingsAfterFlightTry / dailyCostModerateTry);
          remainingPocketMoneyModerateTry = Math.round((savingsAfterFlightTry - maxFreeDaysModerate * dailyCostModerateTry) * 100) / 100;

          maxFreeDaysLuxury = Math.floor(savingsAfterFlightTry / dailyCostLuxuryTry);
          remainingPocketMoneyLuxuryTry = Math.round((savingsAfterFlightTry - maxFreeDaysLuxury * dailyCostLuxuryTry) * 100) / 100;

          if (maxFreeDaysBudget >= 1) {
            if (maxFreeDaysLuxury >= 1) {
              dealVerdict = `Uçuş + Ekonomik ${maxFreeDaysBudget} Gün | Standart ${maxFreeDaysModerate} Gün | Lüks ${maxFreeDaysLuxury} Gün Bedava!`;
            } else if (maxFreeDaysModerate >= 1) {
              dealVerdict = `Uçuş + Ekonomik ${maxFreeDaysBudget} Gün | Standart ${maxFreeDaysModerate} Gün Bedava!`;
            } else {
              dealVerdict = `Uçuş + Ekonomik ${maxFreeDaysBudget} Gün Bedava! (+${remainingPocketMoneyBudgetTry.toLocaleString('tr-TR')} ₺ Harçlık)`;
            }
          } else {
            dealVerdict = `Gidiş-Dönüş Uçak Biletiniz %100 Bedavaya Geliyor! (+${Math.round(savingsAfterFlightTry).toLocaleString('tr-TR')} ₺ Kalan Bütçe)`;
          }
        } else {
          maxFreeDaysBudget = 0;
          maxFreeDaysModerate = 0;
          maxFreeDaysLuxury = 0;
          const flightCoverPct =
            flightPriceTry > 0
              ? Math.min(99, Math.round((arbitrage.netSavingsTry / flightPriceTry) * 100))
              : Math.min(99, fundingPercentage);
          dealVerdict = `Gidiş-dönüş uçak biletinizin %${flightCoverPct}'i ürün kazancınızla ödeniyor.`;
        }

        const maxFreeDays = maxFreeDaysBudget;
        const dailyStayCostTry = dailyCostModerateTry;
        const remainingPocketMoneyTry = remainingPocketMoneyModerateTry;

        return {
          destination: dest,
          product,
          arbitrage,
          travelEstimate,
          fundingPercentage,
          isTripFree: netSurplusTry >= 0 || maxFreeDaysBudget >= 1,
          netSurplusTry,
          maxFreeDays,
          maxFreeDaysBudget,
          maxFreeDaysModerate,
          maxFreeDaysLuxury,
          dailyCostBudgetTry,
          dailyCostModerateTry,
          dailyCostLuxuryTry,
          remainingPocketMoneyBudgetTry,
          remainingPocketMoneyModerateTry,
          remainingPocketMoneyLuxuryTry,
          remainingPocketMoneyTry,
          dealVerdict,
          dailyStayCostTry,
          savingsAfterFlightTry,
        } as ReverseArbitrageDeal;
      } catch (e) {
        // Skip destination if pricing is not mapped
        return null;
      }
    });

    const results = await Promise.all(dealPromises);
    const validDeals = results.filter((d): d is ReverseArbitrageDeal => d !== null);

    return validDeals.sort((a, b) => {
      if (b.maxFreeDaysBudget !== a.maxFreeDaysBudget) {
        return b.maxFreeDaysBudget - a.maxFreeDaysBudget;
      }
      return b.fundingPercentage - a.fundingPercentage;
    });
  }
}
