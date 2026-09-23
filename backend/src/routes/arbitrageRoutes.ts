import { Router } from 'express';
import { ArbitrageController } from '../controllers/arbitrageController';

const router = Router();

router.get('/product/:productId', ArbitrageController.calculateSingle);
router.post('/basket', ArbitrageController.calculateBasket);
router.get('/reverse/:productId', ArbitrageController.getReverseDeals);

export default router;
