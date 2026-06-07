import express from 'express';
import * as cartController from './cartController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js'; 
// Ensure you point the path above to your backend's global JWT token checker middleware module

const router = express.Router();

router.post('/', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.put('/:itemId', authMiddleware, cartController.updateQuantity);
router.delete('/:itemId', authMiddleware, cartController.removeCartItem);

export default router;