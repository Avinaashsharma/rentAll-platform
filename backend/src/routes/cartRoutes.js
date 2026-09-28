const express = require('express');
const protect = require('../middleware/protect');
const validate = require('../utils/validate');
const {
  addItemRules,
  updateQuantityRules,
  removeItemRules,
} = require('../validators/cartValidator');
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addItemRules, validate, addItem);

router.route('/items/:itemId')
  .patch(updateQuantityRules, validate, updateItemQuantity)
  .delete(removeItemRules, validate, removeItem);

module.exports = router;
