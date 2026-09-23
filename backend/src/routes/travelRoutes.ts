import { Router } from 'express';
import { TravelController } from '../controllers/travelController';

const router = Router();

router.get('/destinations', TravelController.getDestinations);
router.post('/quote', TravelController.getTravelQuote);
router.get('/ticker', TravelController.getMarketTickers);
router.get('/airports', TravelController.searchAirports);

export default router;
