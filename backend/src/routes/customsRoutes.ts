import { Router } from 'express';
import { CustomsController } from '../controllers/customsController';

const router = Router();

router.get('/vat-rules', CustomsController.getVatRules);
router.get('/regulations', CustomsController.getCustomsRules);

export default router;
