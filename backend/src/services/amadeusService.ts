import axios from 'axios';
import { config } from '../config';
import { ExchangeRateService } from './exchangeRateService';
import { GoogleFlightsService } from './googleFlightsService';

export interface AmadeusFlightResult {
  priceInTry: number;
  currency: string;
  airline: string;
  outboundRoute: string;
  inboundRoute: string;
  isLive: boolean;
}

export class AmadeusService {
  private static instance: AmadeusService;
  private fxService = ExchangeRateService.getInstance();
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private constructor() {}

  public static getInstance(): AmadeusService {
    if (!AmadeusService.instance) {
      AmadeusService.instance = new AmadeusService();
    }
    return AmadeusService.instance;
  }

  /**
   * Fetches live flight offers between origin and destination.
   * Priority:
   * 1. Google Flights via SerpApi (Live live rates directly from Google)
   * 2. RapidAPI Skyscanner / Booking.com
   * 3. Amadeus Self-Service (if configured)
   */
  public async searchFlightOffers(
    origin: string,
    destination: string,
    departureDate: string,
    returnDate: string
  ): Promise<AmadeusFlightResult> {
    // 1. Try Google Flights via SerpApi
    if (config.serpApi.key) {
      try {
        const googleFlightsService = GoogleFlightsService.getInstance();
        const googleResult = await googleFlightsService.searchRoundtrip(
          origin,
          destination,
          departureDate,
          returnDate
        );
        if (googleResult) return googleResult;
      } catch (err: any) {
        console.warn(`[Google Flights SerpApi] Notice: ${err.message}`);
      }
    }

    // 2. Try RapidAPI Skyscanner / Booking.com
    if (config.rapidApi.key) {
      try {
        const rapidResult = await this.querySkyscannerRapidApi(
          origin,
          destination,
          departureDate,
          returnDate
        );
        if (rapidResult) return rapidResult;
      } catch (err: any) {
        console.warn(`[RapidAPI Skyscanner] Notice: ${err.message}`);
      }
    }

    // 2. Try Amadeus Self-Service
    if (config.amadeus.clientId && config.amadeus.clientSecret) {
      try {
        const liveResult = await this.queryAmadeusApi(
          origin,
          destination,
          departureDate,
          returnDate
        );
        if (liveResult) return liveResult;
      } catch (err: any) {
        console.warn(`[Amadeus API] Notice: ${err.message}.`);
      }
    }

    // 3. When APIs are unavailable or quota reached, return transparent zero-quote state (no mock data)
    return {
      priceInTry: 0,
      currency: 'TRY',
      airline: 'Canlı Bilet API Bağlantısı Bekleniyor',
      outboundRoute: `${origin} -> ${destination} (Canlı Arama)`,
      inboundRoute: `${destination} -> ${origin} (Canlı Arama)`,
      isLive: false,
    };
  }

  /**
   * Skyscanner / Booking.com RapidAPI Integration (flights-sky)
   */
  private async querySkyscannerRapidApi(
    origin: string,
    destination: string,
    departureDate: string,
    returnDate: string
  ): Promise<AmadeusFlightResult | null> {
    try {
      // RapidAPI flights-sky Booking.com Roundtrip Search endpoint
      const url = `https://${config.rapidApi.host}/bookingcom/search-roundtrip`;
      
      const departId = origin.includes('.') ? origin : `${origin.toUpperCase()}.AIRPORT`;
      const arrivalId = destination.includes('.') ? destination : `${destination.toUpperCase()}.AIRPORT`;

      const response = await axios.get(url, {
        headers: {
          'x-rapidapi-host': config.rapidApi.host,
          'x-rapidapi-key': config.rapidApi.key,
        },
        params: {
          departId,
          arrivalId,
          departDate: departureDate,
          returnDate: returnDate,
          currency: 'USD',
        },
        timeout: 15000,
      });

      const offers = response.data?.data?.flightOffers;
      if (offers && offers.length > 0) {
        const cheapest = offers[0];
        const units = cheapest.priceBreakdown?.total?.units || 0;
        const nanos = cheapest.priceBreakdown?.total?.nanos || 0;
        const rawPrice = units + nanos / 1e9;
        const currency = cheapest.priceBreakdown?.total?.currencyCode || 'USD';

        const priceTry = await this.fxService.convertToTRY(rawPrice, currency);
        const carrier =
          cheapest.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.name ||
          cheapest.segments?.[0]?.legs?.[0]?.flightInfo?.carrierInfo?.marketingCarrier ||
          'International Airline';

        return {
          priceInTry: Math.round(priceTry),
          currency,
          airline: carrier,
          outboundRoute: `${origin} -> ${destination} (Live API)`,
          inboundRoute: `${destination} -> ${origin} (Live API)`,
          isLive: true,
        };
      }
    } catch (err: any) {
      console.warn(`[RapidAPI Flights] Notice: ${err.message}.`);
      return null;
    }
    return null;
  }

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', config.amadeus.clientId);
      params.append('client_secret', config.amadeus.clientSecret);

      const response = await axios.post(
        `https://${config.amadeus.hostname}/v1/security/oauth2/token`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
      return this.accessToken;
    } catch (error: any) {
      return null;
    }
  }

  private async queryAmadeusApi(
    origin: string,
    destination: string,
    departureDate: string,
    returnDate: string
  ): Promise<AmadeusFlightResult | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    const response = await axios.get(`https://${config.amadeus.hostname}/v2/shopping/flight-offers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        originLocationCode: origin.toUpperCase(),
        destinationLocationCode: destination.toUpperCase(),
        departureDate,
        returnDate,
        adults: 1,
        currencyCode: 'EUR',
        max: 5,
      },
      timeout: 6000,
    });

    const offers = response.data?.data;
    if (offers && offers.length > 0) {
      const bestOffer = offers[0];
      const eurPrice = parseFloat(bestOffer.price.grandTotal || bestOffer.price.total);
      const tryPrice = await this.fxService.convertToTRY(eurPrice, 'EUR');
      const carrierCode = bestOffer.validatingAirlineCodes?.[0] || 'TK';

      return {
        priceInTry: Math.round(tryPrice),
        currency: 'EUR',
        airline: carrierCode,
        outboundRoute: `${origin} -> ${destination}`,
        inboundRoute: `${destination} -> ${origin}`,
        isLive: true,
      };
    }

    return null;
  }
}
