import axios from 'axios';
import { config } from '../config';
import { AmadeusFlightResult } from './amadeusService';

interface CacheEntry {
  result: AmadeusFlightResult;
  expiresAt: number;
}

export class GoogleFlightsService {
  private static instance: GoogleFlightsService;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes in-memory cache

  private constructor() {}

  public static getInstance(): GoogleFlightsService {
    if (!GoogleFlightsService.instance) {
      GoogleFlightsService.instance = new GoogleFlightsService();
    }
    return GoogleFlightsService.instance;
  }

  /**
   * Searches live roundtrip flights on Google Flights via SerpApi
   */
  public async searchRoundtrip(
    origin: string,
    destination: string,
    departureDate: string,
    returnDate: string
  ): Promise<AmadeusFlightResult | null> {
    const key = config.serpApi.key;
    if (!key) return null;

    const cacheKey = `${origin.toUpperCase()}_${destination.toUpperCase()}_${departureDate}_${returnDate}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.result;
    }

    try {
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_flights',
          departure_id: origin.toUpperCase(),
          arrival_id: destination.toUpperCase(),
          outbound_date: departureDate,
          return_date: returnDate,
          currency: 'TRY',
          hl: 'tr',
          api_key: key,
        },
        timeout: 20000,
      });

      const bestFlights = response.data?.best_flights;
      const otherFlights = response.data?.other_flights;
      const candidates = (bestFlights && bestFlights.length > 0) ? bestFlights : otherFlights;

      if (Array.isArray(candidates) && candidates.length > 0) {
        const topFlight = candidates[0];
        const priceTry = typeof topFlight.price === 'number' ? topFlight.price : parseFloat(topFlight.price || '0');

        const firstLeg = topFlight.flights?.[0];
        const airline = firstLeg?.airline || topFlight.airline || 'Google Flights Carrier';
        const flightNumber = firstLeg?.flight_number ? ` (${firstLeg.flight_number})` : '';
        const durationMinutes = topFlight.total_duration;
        const durationHours = durationMinutes ? `${Math.floor(durationMinutes / 60)}s ${durationMinutes % 60}dk` : '';

        const outboundRoute = `${origin.toUpperCase()} ✈ ${destination.toUpperCase()} • ${airline}${flightNumber} ${durationHours ? `(${durationHours})` : ''}`.trim();
        const inboundRoute = `${destination.toUpperCase()} ✈ ${origin.toUpperCase()} • En Uygun Dönüş`;

        const result: AmadeusFlightResult = {
          priceInTry: Math.round(priceTry),
          currency: 'TRY',
          airline: airline,
          outboundRoute,
          inboundRoute,
          isLive: true,
        };

        // Cache the successful result
        this.cache.set(cacheKey, {
          result,
          expiresAt: Date.now() + this.CACHE_TTL_MS,
        });

        return result;
      }
    } catch (err: any) {
      console.warn(`[GoogleFlightsService SerpApi] Note: ${err.response?.data?.error || err.message}`);
      return null;
    }

    return null;
  }
}
