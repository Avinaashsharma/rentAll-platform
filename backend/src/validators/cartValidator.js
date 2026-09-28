const { body, param } = require('express-validator');

const addItemRules = [
  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Invalid item ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10')
    .toInt(),
];

const updateQuantityRules = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid item ID'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10')
    .toInt(),
];

const removeItemRules = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid item ID'),
];

module.exports = {
  addItemRules,
  updateQuantityRules,
  removeItemRules,
};
