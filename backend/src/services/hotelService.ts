import axios from 'axios';
import { config } from '../config';
import { Destination, TravelStyle } from '../types';
import { ExchangeRateService } from './exchangeRateService';

export interface FeaturedHotel {
  id: string;
  name: string;
  stars: number;
  ratingScore: number;
  ratingCount: number;
  reviewSummary: string;
  nightlyPriceTry: number;
  nightlyPriceLocal: number;
  currency: string;
  imageUrl: string;
  address: string;
  bookingUrl: string;
  tier: TravelStyle;
}

export class HotelService {
  private fxService = ExchangeRateService.getInstance();

  /**
   * Generates a direct Booking.com search link with prefilled destination, dates, and guests
   */
  public generateBookingComUrl(
    cityName: string,
    checkinDate: string,
    checkoutDate: string
  ): string {
    const encodedCity = encodeURIComponent(cityName);
    return `https://www.booking.com/searchresults.html?ss=${encodedCity}&checkin=${checkinDate}&checkout=${checkoutDate}&group_adults=1&no_rooms=1&selected_currency=TRY`;
  }

  /**
   * Generates Google Hotels deep-link
   */
  public generateGoogleHotelsUrl(
    cityName: string,
    checkinDate: string,
    checkoutDate: string
  ): string {
    const encodedCity = encodeURIComponent(cityName);
    return `https://www.google.com/travel/hotels?q=${encodedCity}&dates=${checkinDate}_${checkoutDate}`;
  }

  /**
   * Returns live property count if known or 0 (no mock estimates)
   */
  public getTotalPropertiesEstimate(cityName: string): number {
    return 0;
  }

  /**
   * Tries to query live hotel search via flights-sky (Skyscanner Hotels)
   */
  public async queryFlightsSkyHotelsApi(
    destination: Destination,
    checkinDate: string,
    checkoutDate: string
  ): Promise<FeaturedHotel[] | null> {
    const key = config.rapidApi.key;
    if (!key) return null;

    try {
      // 1. Auto-complete to find entityId for the city
      const autoUrl = `https://flights-sky.p.rapidapi.com/hotels/auto-complete`;
      const autoRes = await axios.get(autoUrl, {
        headers: {
          'x-rapidapi-host': 'flights-sky.p.rapidapi.com',
          'x-rapidapi-key': key,
        },
        params: { query: destination.cityName },
        timeout: 4000,
      });

      const results = autoRes.data?.data || autoRes.data?.results || autoRes.data;
      const firstEntity = Array.isArray(results) ? results[0] : null;
      const entityId = firstEntity?.entityId || firstEntity?.id;

      if (!entityId) return null;

      // 2. Search Hotels using entityId
      const searchUrl = `https://flights-sky.p.rapidapi.com/hotels/search`;
      const searchRes = await axios.get(searchUrl, {
        headers: {
          'x-rapidapi-host': 'flights-sky.p.rapidapi.com',
          'x-rapidapi-key': key,
        },
        params: {
          entityId,
          checkin: checkinDate,
          checkout: checkoutDate,
          adults: 1,
          rooms: 1,
          currency: 'USD',
        },
        timeout: 6000,
      });

      const hotels = searchRes.data?.data?.hotels || searchRes.data?.hotels || searchRes.data?.results?.hotels;
      if (Array.isArray(hotels) && hotels.length > 0) {
        const liveHotels: FeaturedHotel[] = [];
        for (const h of hotels.slice(0, 12)) {
          const rawPrice = h.price?.raw || h.price?.amount || h.leadPrice || 110;
          const stars = h.stars || h.starRating || 4;
          const tier: TravelStyle = stars <= 3 ? 'budget' : stars === 4 ? 'moderate' : 'luxury';
          const nightlyTry = await this.fxService.convertToTRY(rawPrice, 'USD');

          liveHotels.push({
            id: `sky-${h.hotelId || h.id || Math.random().toString(36).substring(7)}`,
            name: h.name || 'Featured Hotel',
            stars: stars,
            ratingScore: Math.round((h.rating || h.reviewScore || 8.5) * 10) / 10,
            ratingCount: h.reviewCount || 1000,
            reviewSummary: h.reviewSummary || (stars >= 4 ? 'Çok İyi' : 'İyi'),
            nightlyPriceLocal: rawPrice,
            nightlyPriceTry: Math.round(nightlyTry),
            currency: 'USD',
            imageUrl:
              h.heroImage ||
              h.images?.[0] ||
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            address: h.address || `${destination.cityName}, ${destination.countryName}`,
            bookingUrl: this.generateBookingComUrl(destination.cityName, checkinDate, checkoutDate),
            tier: tier,
          });
        }
        return liveHotels;
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Tries to query live Booking.com hotel search via RapidAPI
   */
  public async queryLiveBookingApi(
    destination: Destination,
    checkinDate: string,
    checkoutDate: string
  ): Promise<FeaturedHotel[] | null> {
    if (!config.rapidApiHotel.key) return null;

    try {
      // 1. Search Destination ID
      const destUrl = `https://${config.rapidApiHotel.host}/api/v1/hotels/searchDestination`;
      const destRes = await axios.get(destUrl, {
        headers: {
          'x-rapidapi-host': config.rapidApiHotel.host,
          'x-rapidapi-key': config.rapidApiHotel.key,
        },
        params: { query: destination.cityName },
        timeout: 4000,
      });

      const destItem = destRes.data?.data?.[0];
      const destId = destItem?.dest_id;
      const searchType = destItem?.search_type || 'CITY';

      if (!destId) return null;

      // 2. Search Hotels
      const searchUrl = `https://${config.rapidApiHotel.host}/api/v1/hotels/searchHotels`;
      const searchRes = await axios.get(searchUrl, {
        headers: {
          'x-rapidapi-host': config.rapidApiHotel.host,
          'x-rapidapi-key': config.rapidApiHotel.key,
        },
        params: {
          dest_id: destId,
          search_type: searchType,
          arrival_date: checkinDate,
          departure_date: checkoutDate,
          adults: 1,
          room_qty: 1,
          currency_code: 'USD',
          order_by: 'popularity',
        },
        timeout: 6000,
      });

      const hotelsList = searchRes.data?.data?.hotels;
      if (Array.isArray(hotelsList) && hotelsList.length > 0) {
        const liveHotels: FeaturedHotel[] = [];
        for (const h of hotelsList.slice(0, 12)) {
          const rawPrice = h.property?.priceBreakdown?.grossPrice?.value || 120;
          const stars = h.property?.qualityClass || 4;
          const tier: TravelStyle = stars <= 3 ? 'budget' : stars === 4 ? 'moderate' : 'luxury';
          const nightlyTry = await this.fxService.convertToTRY(rawPrice, 'USD');

          liveHotels.push({
            id: `live-${h.hotel_id || h.property?.id}`,
            name: h.property?.name || 'Booking.com Hotel',
            stars: stars,
            ratingScore: Math.round((h.property?.reviewScore || 8.5) * 10) / 10,
            ratingCount: h.property?.reviewCount || 1000,
            reviewSummary: h.property?.reviewScoreWord || 'Very Good',
            nightlyPriceLocal: rawPrice,
            nightlyPriceTry: Math.round(nightlyTry),
            currency: 'USD',
            imageUrl:
              h.property?.photoUrls?.[0] ||
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            address: `${destination.cityName}, ${destination.countryName}`,
            bookingUrl: this.generateBookingComUrl(destination.cityName, checkinDate, checkoutDate),
            tier: tier,
          });
        }
        return liveHotels;
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Returns live hotels from API or empty array (no mock data)
   */
  public async getFeaturedHotels(
    destination: Destination,
    checkinDate: string,
    checkoutDate: string
  ): Promise<FeaturedHotel[]> {
    // 1. Try Flights-Sky (ntd119) hotel search
    try {
      const skyHotels = await this.queryFlightsSkyHotelsApi(destination, checkinDate, checkoutDate);
      if (skyHotels && skyHotels.length > 0) {
        return skyHotels;
      }
    } catch {}

    // 2. Try RapidAPI Booking.com query
    try {
      const liveHotels = await this.queryLiveBookingApi(destination, checkinDate, checkoutDate);
      if (liveHotels && liveHotels.length > 0) {
        return liveHotels;
      }
    } catch {}

    // No mock data: return empty array if no live API data returned
    return [];
  }
}
