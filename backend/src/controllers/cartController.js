const catchAsync = require('../utils/catchAsync');
const cartService = require('../services/cartService');

// GET /api/v1/cart
const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.status(200).json({ status: 'success', data: { cart } });
});

// POST /api/v1/cart/items
const addItem = catchAsync(async (req, res) => {
  const cart = await cartService.addItem({
    userId: req.user._id,
    itemId: req.body.itemId,
    quantity: req.body.quantity,
  });
  res.status(200).json({ status: 'success', data: { cart } });
});

// PATCH /api/v1/cart/items/:itemId
const updateItemQuantity = catchAsync(async (req, res) => {
  const cart = await cartService.updateItemQuantity({
    userId: req.user._id,
    itemId: req.params.itemId,
    quantity: req.body.quantity,
  });
  res.status(200).json({ status: 'success', data: { cart } });
});

// DELETE /api/v1/cart/items/:itemId
const removeItem = catchAsync(async (req, res) => {
  const cart = await cartService.removeItem({
    userId: req.user._id,
    itemId: req.params.itemId,
  });
  res.status(200).json({ status: 'success', data: { cart } });
});

// DELETE /api/v1/cart
const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.status(200).json({ status: 'success', data: { cart } });
});

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};
