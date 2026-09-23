import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ArbitrageService } from '../services/arbitrageService';

const arbitrageService = new ArbitrageService();

const BasketCalculationSchema = z.object({
  travel: z.object({
    originAirport: z.string().default('IST'),
    destinationAirport: z.string(),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    durationDays: z.number().int().positive().default(4),
    travelStyle: z.enum(['budget', 'moderate', 'luxury']).default('moderate'),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      destinationAirport: z.string().optional(),
      quantity: z.number().int().positive().default(1),
    })
  ).default([]),
});

export class ArbitrageController {
  public static async calculateSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId;
      const destinationAirport = (req.query.destination as string) || 'NRT';

      const result = await arbitrageService.calculateSingleProductArbitrage(
        productId,
        destinationAirport
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async calculateBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const { travel, items } = BasketCalculationSchema.parse(req.body);

      const normalizedItems = items.map((it) => ({
        productId: it.productId,
        destinationAirport: travel.destinationAirport,
        quantity: it.quantity,
      }));

      const result = await arbitrageService.calculateBasketArbitrage(travel, normalizedItems);

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getReverseDeals(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId;
      const deals = await arbitrageService.findReverseArbitrageDeals(productId);

      res.json({
        success: true,
        count: deals.length,
        data: deals,
      });
    } catch (err) {
      next(err);
    }
  }
}
