import { body, validationResult } from 'express-validator';

export const registerUserValidator = [
  body('email')
    .trim()
    .exists()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('name')
    .trim()
    .exists()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be b/w 2-50 characters long'),

  body('password')
    .trim()
    .exists()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

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

export const loginUserValidator = [
  body('email')
    .trim()
    .exists()
    .withMessage('Email is required')
    .bail()
    .isString()
    .withMessage('Email must be a string')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .trim()
    .exists()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

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
