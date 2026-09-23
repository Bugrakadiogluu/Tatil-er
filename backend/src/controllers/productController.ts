import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';

const productService = new ProductService();

export class ProductController {
  public static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.q as string | undefined;

      let products;
      if (search) {
        products = await productService.searchProducts(search);
      } else {
        products = await productService.getAllProducts(category);
      }

      res.json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async discoverProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.body?.query || req.query?.q || '') as string;
      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'A search query is required to discover products',
        });
      }

      const products = await productService.discoverProduct(query.trim());
      res.json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }
}
