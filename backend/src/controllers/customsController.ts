import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { TaxCustomsService } from '../services/taxCustomsService';

const taxCustomsService = new TaxCustomsService();

export class CustomsController {
  public static async getVatRules(req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await taxCustomsService.getAllVATRules();
      res.json({
        success: true,
        data: rules,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getCustomsRules(req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await taxCustomsService.getAllCustomsRules();
      res.json({
        success: true,
        parameters: {
          imeiFeeTry: config.customsTR.imeiFeeTry,
          trtBandrolEurPhone: config.customsTR.trtBandrolEurPhone,
          maxPhonesPerTrip: config.customsTR.maxPhonesPerTrip,
          yearsBetweenPhoneImports: config.customsTR.yearsBetweenPhoneImports,
        },
        rules,
      });
    } catch (err) {
      next(err);
    }
  }
}

