import express from 'express';
import * as cartController from './cartController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js'; 
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('customer'), cartController.addToCart);
router.get('/', authMiddleware, roleMiddleware('customer'), cartController.getCart);
router.put('/:itemId', authMiddleware, roleMiddleware('customer'), cartController.updateQuantity);
router.delete('/:itemId', authMiddleware, roleMiddleware('customer'), cartController.removeCartItem);

export default router;