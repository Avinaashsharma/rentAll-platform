const Cart = require('../models/Cart');
const Item = require('../models/Item');
const AppError = require('../utils/AppError');

const POPULATE_FIELDS = {
  path: 'items.item',
  select: 'name slug category dailyRate securityDeposit status condition images',
};

/**
 * Get the current user's cart, creating one if it doesn't exist.
 */
const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(POPULATE_FIELDS);

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate(POPULATE_FIELDS);
  }

  return cart;
};

/**
 * Add an item to the cart. If the item already exists, increment its quantity.
 */
const addItem = async ({ userId, itemId, quantity = 1 }) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new AppError('Item not found.', 404);
  }

  if (item.status !== 'available') {
    throw new AppError('This item is not available for rental.', 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingEntry = cart.items.find(
    (entry) => entry.item.toString() === itemId
  );

  if (existingEntry) {
    const newQty = existingEntry.quantity + quantity;
    if (newQty > 10) {
      throw new AppError('Maximum quantity per item is 10.', 400);
    }
    existingEntry.quantity = newQty;
  } else {
    if (cart.items.length >= 50) {
      throw new AppError('Cart cannot contain more than 50 items.', 400);
    }
    cart.items.push({ item: itemId, quantity });
  }

  await cart.save();
  return cart.populate(POPULATE_FIELDS);
};

/**
 * Update the quantity of a specific item in the cart.
 */
const updateItemQuantity = async ({ userId, itemId, quantity }) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const entry = cart.items.find(
    (e) => e.item.toString() === itemId
  );

  if (!entry) {
    throw new AppError('Item not found in cart.', 404);
  }

  entry.quantity = quantity;
  await cart.save();
  return cart.populate(POPULATE_FIELDS);
};

/**
 * Remove an item from the cart entirely.
 */
const removeItem = async ({ userId, itemId }) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const index = cart.items.findIndex(
    (e) => e.item.toString() === itemId
  );

  if (index === -1) {
    throw new AppError('Item not found in cart.', 404);
  }

  cart.items.splice(index, 1);
  await cart.save();
  return cart.populate(POPULATE_FIELDS);
};

/**
 * Clear the entire cart.
 */
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  cart.items = [];
  await cart.save();
  return cart.populate(POPULATE_FIELDS);
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};
