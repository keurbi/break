import { body, param } from 'express-validator';

export const createUserValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6, max: 128 }),
  body('firstName').isString().trim().isLength({ min: 1, max: 60 }),
  body('lastName').isString().trim().isLength({ min: 1, max: 60 }),
  body('department').optional().isString().trim().isLength({ max: 120 }),
  body('role').optional().isIn(['user', 'manager', 'rh']),
];

export const updateUserValidators = [
  param('id').isString().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isString().isLength({ min: 6, max: 128 }),
  body('firstName').optional().isString().trim().isLength({ min: 1, max: 60 }),
  body('lastName').optional().isString().trim().isLength({ min: 1, max: 60 }),
  body('department').optional().isString().trim().isLength({ max: 120 }),
  body('role').optional().isIn(['user', 'manager', 'rh']),
];

export const idParamValidator = [param('id').isString().trim().notEmpty()];
