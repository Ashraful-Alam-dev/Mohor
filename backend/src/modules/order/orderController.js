import * as orderService from './orderService.js';

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const { items, shippingAddress, phone, paymentMethod, clearCart } = req.body;

    const result = await orderService.createOrderInDb({
      userId,
      items,
      shippingAddress,
      phone,
      paymentMethod,
      clearCart
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getUserOrdersFromDb(userId);
    
    const formattedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    return res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const searchProduct = req.query.product || '';
    const rawOrders = await orderService.getAllOrdersForAdminFromDb(searchProduct);

    const formattedOrders = rawOrders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    return res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
};

export const modifyStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    await orderService.updateOrderStatusInDb(orderId, status);
    return res.status(200).json({ 
      success: true, 
      message: `Order status successfully transitioned to "${status}".` 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};