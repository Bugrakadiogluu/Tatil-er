import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();

router.get('/', ProductController.getProducts);
router.post('/discover', ProductController.discoverProduct);
router.get('/discover', ProductController.discoverProduct);
router.get('/:id', ProductController.getProductById);

export default router;
