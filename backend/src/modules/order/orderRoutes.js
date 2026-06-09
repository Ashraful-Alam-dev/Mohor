import { Router } from 'express';
import { placeOrder, getMyOrders, getAdminOrders, modifyStatus } from './orderController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = Router();

router.post('/', authMiddleware, roleMiddleware('customer'), placeOrder);
router.get('/my-orders', authMiddleware, roleMiddleware('customer'), getMyOrders);

router.get('/admin/all', authMiddleware, roleMiddleware('admin'), getAdminOrders);
router.patch('/admin/:orderId/status', authMiddleware, roleMiddleware('admin'), modifyStatus);
export default router;