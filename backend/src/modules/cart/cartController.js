import * as cartService from './cartService.js';
import * as auditService from "../audit/auditService.js";

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product parameters or quantity specifications provided.' 
      });
    }

    const cartData = await cartService.addItemToCartInDb(userId, { productId, quantity });
    
    // AUDIT LOG: Pass productId and let audit service fetch product name
    try {
      await auditService.logCartAdded(productId, userId, quantity);
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Cart metrics updated successfully.', 
      data: cartData 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.uid || req.user;

    if (!userId || typeof userId === 'object') {
      return res.status(401).json({ 
        success: false, 
        message: 'Unable to extract valid user identifier from session token.' 
      });
    }

    const items = await cartService.getUserCartFromDb(userId);
    
    return res.status(200).json({ 
      success: true, 
      cart: items 
    });
  } catch (error) {
    next(error); 
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id;
    const itemId = req.params.itemId;
    
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Target update count must be at least 1 unit.' 
      });
    }

    // Get cart item details before update for audit
    let productId = null;
    let oldQuantity = null;
    let productName = null;
    
    try {
      const cartItem = await cartService.getCartItemByIdFromDb(itemId);
      if (cartItem) {
        productId = cartItem.product_id;
        oldQuantity = cartItem.quantity;
        productName = cartItem.product_name;
      }
    } catch (error) {
      console.error('Failed to fetch cart item for audit:', error);
    }

    const success = await cartService.updateCartItemQuantityInDb(userId, itemId, quantity);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: 'Target cart item selection index missing.' 
      });
    }
    
    // AUDIT LOG: Pass product object with name
    if (productId && oldQuantity) {
      try {
        await auditService.logCartQuantityUpdated(
          { id: productId, name: productName },
          oldQuantity,
          quantity,
          userId
        );
      } catch (auditError) {
        console.error('Audit logging failed:', auditError);
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Cart items counter aligned successfully.' 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    
    // Get cart item details before removal for audit
    let removedItemDetails = null;
    try {
      const cartItem = await cartService.getCartItemByIdFromDb(itemId);
      if (cartItem) {
        removedItemDetails = cartItem;
      }
    } catch (error) {
      console.error('Failed to fetch cart item for audit:', error);
    }
    
    const success = await cartService.removeCartItemFromDb(userId, itemId);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: 'Target profile row missing from cart selection records.' 
      });
    }
    
    // AUDIT LOG: Pass product object with name
    if (removedItemDetails) {
      try {
        await auditService.logCartRemoved(
          {
            id: removedItemDetails.product_id,
            name: removedItemDetails.product_name
          },
          userId,
          removedItemDetails.quantity
        );
      } catch (auditError) {
        console.error('Audit logging failed:', auditError);
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Item safely purged from current cart context.' 
    });
  } catch (error) {
    next(error);
  }
};