import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ArbitrageService } from '../services/arbitrageService';
import { ExchangeRateService } from '../services/exchangeRateService';
import { AirportService } from '../services/airportService';

const travelService = new ArbitrageService();
const fxService = ExchangeRateService.getInstance();

const TravelQuoteSchema = z.object({
  originAirport: z.string().min(2).max(20).default('IST'),
  destinationAirport: z.string().min(2).max(20),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  durationDays: z.number().int().positive().default(4),
  travelStyle: z.enum(['budget', 'moderate', 'luxury']).default('moderate'),
});

export class TravelController {
  public static async getDestinations(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await travelService.getAllDestinations();
      res.json({
        success: true,
        data: destinations,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTravelQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = TravelQuoteSchema.parse(req.body);
      const quote = await travelService.getTravelQuote(validated);
      res.json({
        success: true,
        data: quote,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getMarketTickers(req: Request, res: Response, next: NextFunction) {
    try {
      const tickers = await fxService.getMarketTickers();
      res.json({
        success: true,
        count: tickers.length,
        data: tickers,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async searchAirports(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q || req.query.query) as string | undefined;
      const airports = await AirportService.searchAirports(query);
      res.json({
        success: true,
        count: airports.length,
        data: airports,
      });
    } catch (err) {
      next(err);
    }
  }
}
