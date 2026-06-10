import * as orderService from './orderService.js';
import * as auditService from "../audit/auditService.js";

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const { items, shippingAddress, phone, paymentMethod, clearCart } = req.body;

    // Validate required fields
    if (!items || !items.length || !shippingAddress || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: items, shippingAddress, or phone' 
      });
    }

    const result = await orderService.createOrderInDb({
      userId,
      items,
      shippingAddress,
      phone,
      paymentMethod,
      clearCart
    });

    // AUDIT LOG: Order placed
    try {
      await auditService.logOrderPlaced(
        { 
          id: result.orderId, 
          total_amount: result.totalAmount 
        }, 
        userId
      );
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Order placed successfully'
    });
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

    // OPTIONAL AUDIT LOG: View orders (can be commented if too verbose)
    // Uncomment if you want to track order views
    /*
    try {
      await auditService.logOrderViewed(userId, orders.length);
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }
    */

    return res.status(200).json({ 
      success: true, 
      orders: formattedOrders,
      count: formattedOrders.length
    });
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

    // OPTIONAL AUDIT LOG: Admin viewed orders
    // Uncomment if you want to track admin order views
    /*
    try {
      await auditService.logAdminOrderView(req.user.id, formattedOrders.length, searchProduct);
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }
    */

    return res.status(200).json({ 
      success: true, 
      orders: formattedOrders,
      count: formattedOrders.length,
      searchApplied: searchProduct || null
    });
  } catch (error) {
    next(error);
  }
};

export const modifyStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate status
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Get order details before update for audit
    let oldStatus = null;
    let orderDetails = null;
    try {
      const order = await orderService.getOrderByIdFromDb(orderId);
      if (order) {
        oldStatus = order.status;
        orderDetails = order;
      }
    } catch (error) {
      console.error('Failed to fetch order details for audit:', error);
    }

    await orderService.updateOrderStatusInDb(orderId, status);

    // AUDIT LOG: Order status updated
    try {
      await auditService.logOrderStatusUpdated(
        orderId,
        oldStatus,
        status,
        userId,
        userRole,
        orderDetails
      );
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return res.status(200).json({ 
      success: true, 
      message: `Order status successfully transitioned from "${oldStatus || 'unknown'}" to "${status}".` 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// NEW: Get single order details
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await orderService.getOrderByIdFromDb(orderId, userId, userRole);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or access denied' 
      });
    }

    // Parse items if they're stored as JSON string
    if (order.items && typeof order.items === 'string') {
      order.items = JSON.parse(order.items);
    }

    // OPTIONAL AUDIT LOG: View single order
    /*
    try {
      await auditService.logOrderDetailView(orderId, userId, userRole);
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }
    */

    return res.status(200).json({ 
      success: true, 
      order 
    });
  } catch (error) {
    next(error);
  }
};

// NEW: Cancel order (user self-cancellation)
export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Get order details before cancellation
    const order = await orderService.getOrderByIdFromDb(orderId, userId);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order can be cancelled (only pending orders)
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel order with status: ${order.status}. Only pending orders can be cancelled.` 
      });
    }

    await orderService.updateOrderStatusInDb(orderId, 'cancelled');

    // Restore product quantities if needed
    try {
      await orderService.restoreOrderQuantities(orderId);
    } catch (error) {
      console.error('Failed to restore product quantities:', error);
    }

    // AUDIT LOG: Order cancelled by user
    try {
      await auditService.logOrderCancelled(orderId, userId, 'user', order);
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Order cancelled successfully' 
    });
  } catch (error) {
    next(error);
  }
};