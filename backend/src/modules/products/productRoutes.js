import express from 'express';
import * as productController from './productController.js';
import { upload } from '../../middleware/upload.js';
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

router.post(
  '/', authMiddleware, roleMiddleware('admin'), upload.array('images', 10), productController.createProduct);

router.put(
  '/:id', authMiddleware, roleMiddleware('admin'), productController.updateProduct);

router.delete(
  '/:id', authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

export default router;