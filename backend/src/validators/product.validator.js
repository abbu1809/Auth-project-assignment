import { body, param, validationResult } from 'express-validator';

export const createProductValidator = [
  body('title')
    .exists()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be b/w 2-50 characters long')
    .bail()
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Title must contain only alphabets and spaces'),
  body('description')
    .exists()
    .withMessage('description is required')
    .bail()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('description must be b/w 20-500 characters long'),

  body('price.amount')
    .exists()
    .withMessage('price is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('price must be a number')
    .bail()
    .custom((value) => value >= 0)
    .withMessage('price must be a positive number'),
  body('price.currency')
    .exists()
    .withMessage('currency is required')
    .bail()
    .isString()
    .withMessage('currency must be a string')
    .bail()
    .isIn(['USD', 'INR'])
    .withMessage('currency must be either USD or INR'),
  body('sizes')
    .exists()
    .withMessage('sizes is required')
    .bail()
    .isArray()
    .withMessage('sizes must be an array of objects'),
  body('sizes.*.size')
    .exists()
    .withMessage('sizes is required')
    .bail()
    .trim()
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('size must be one of S, M, L, XL, XXL'),

  body('sizes.*.stock')
    .exists()
    .withMessage('stock is required')
    .bail()
    .isInt({ min: 0 })
    .withMessage('stock must be a positive integer'),

  (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        message: 'invalid request',
        errors: error.array(),
      });
    }
    next();
  },
];

export const unlistProductValidator = [
  param('id')
    .exists()
    .withMessage('Product id is required')
    .bail()
    .isMongoId()
    .withMessage('Product id must be a valid MongoDB ObjectId'),

  (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        message: 'invalid request',
        errors: error.array(),
      });
    }
    next();
  },
];

export const listProductValidator = [
  param('id')
    .exists()
    .withMessage('Product id is required')
    .bail()
    .isMongoId()
    .withMessage('Product id must be a valid MongoDB ObjectId'),

  (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        message: 'invalid request',
        errors: error.array(),
      });
    }
    next();
  },
];

export const updateProductValidator = [
  param('id')
    .exists()
    .withMessage('Product id is required')
    .bail()
    .isMongoId()
    .withMessage('Product id must be a valid MongoDB ObjectId'),
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be b/w 2-100 characters long')
    .bail()
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Title must contain only alphabets and spaces'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('description must be b/w 20-500 characters long'),
  body('price.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('price must be a positive number'),
  body('price.currency')
    .optional()
    .isString()
    .withMessage('currency must be a string')
    .bail()
    .isIn(['USD', 'INR'])
    .withMessage('currency must be either USD or INR'),
  body('sizes')
    .optional()
    .isArray()
    .withMessage('sizes must be an array of objects'),
  body('sizes.*.size')
    .optional()
    .trim()
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('size must be one of XS, S, M, L, XL, XXL'),
  body('sizes.*.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('stock must be a positive integer'),

  (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        message: 'invalid request',
        errors: error.array(),
      });
    }
    next();
  },
];

export const deleteProductValidator = [
  param('id')
    .exists()
    .withMessage('Product id is required')
    .bail()
    .isMongoId()
    .withMessage('Product id must be a valid MongoDB ObjectId'),

  (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        message: 'invalid request',
        errors: error.array(),
      });
    }
    next();
  },
];
