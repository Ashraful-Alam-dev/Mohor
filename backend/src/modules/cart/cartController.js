import * as cartService from './cartService.js';

export const addToCart = async (req, res, next) => {
  try {
    
    const userId = req.user.id; 
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid product parameters or quantity specifications provided.' });
    }

    const cartData = await cartService.addItemToCartInDb(userId, { productId, quantity });
    res.status(200).json({ success: true, message: 'Cart metrics updated successfully.', data: cartData });
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
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Target update count must be at least 1 unit.' });
    }

    const success = await cartService.updateCartItemQuantityInDb(req.user.id, req.params.itemId, quantity);
    if (!success) return res.status(404).json({ success: false, message: 'Target cart item selection index missing.' });

    res.status(200).json({ success: true, message: 'Cart items counter aligned successfully.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const success = await cartService.removeCartItemFromDb(req.user.id, req.params.itemId);
    if (!success) return res.status(404).json({ success: false, message: 'Target profile row missing from cart selection records.' });

    res.status(200).json({ success: true, message: 'Item safely purged from current cart context.' });
  } catch (error) {
    next(error);
  }
};