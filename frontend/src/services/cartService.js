import api from './api';

/**
 * Get the current user's cart.
 */
export const getCart = () => {
  return api.get('/cart');
};

/**
 * Add an item to the cart.
 * @param {string} itemId
 * @param {number} [quantity=1]
 */
export const addCartItem = (itemId, quantity = 1) => {
  return api.post('/cart/items', { itemId, quantity });
};

/**
 * Update the quantity of a cart item.
 * @param {string} itemId
 * @param {number} quantity
 */
export const updateCartItemQuantity = (itemId, quantity) => {
  return api.patch(`/cart/items/${itemId}`, { quantity });
};

/**
 * Remove an item from the cart.
 * @param {string} itemId
 */
export const removeCartItem = (itemId) => {
  return api.delete(`/cart/items/${itemId}`);
};

/**
 * Clear the entire cart.
 */
export const clearCart = () => {
  return api.delete('/cart');
};
