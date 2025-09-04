import { body, param, query } from 'express-validator';

export const listActivitiesValidators = [
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('cursor').optional().isString().trim(),
];

export const createActivityValidators = [
  body('title').isString().trim().isLength({ min: 2, max: 120 }),
  body('description').isString().trim().isLength({ min: 2, max: 2000 }),
  body('type').optional().isString().trim().isLength({ max: 60 }),
  body('subType').optional().isString().trim().isLength({ max: 60 }),
  body('duration').optional().isInt({ min: 1, max: 1440 }).toInt(),
  body('difficulty')
    .optional()
    .custom((val) =>
      (typeof val === 'string' && ['easy', 'medium', 'hard'].includes(val)) ||
      (Number.isInteger(val) && val >= 1 && val <= 3)
    ),
  body('resourceUrl').optional().isURL({ require_protocol: true }).trim(),
  body('resource').optional().isURL({ require_protocol: true }).trim(),
  body('benefits').optional().isArray({ max: 20 }),
  body('benefits.*').optional().isString().trim().isLength({ min: 1, max: 120 }),
  body('tips').optional().isArray({ max: 20 }),
  body('tips.*').optional().isString().trim().isLength({ min: 1, max: 120 }),
  body('tags').optional().isArray({ max: 20 }),
  body('tags.*').optional().isString().trim().isLength({ min: 1, max: 60 }),
];

export const updateActivityValidators = [
  param('id').isString().trim().notEmpty(),
  body('title').optional().isString().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().isString().trim().isLength({ min: 2, max: 2000 }),
  body('type').optional().isString().trim().isLength({ max: 60 }),
  body('subType').optional().isString().trim().isLength({ max: 60 }),
  body('duration').optional().isInt({ min: 1, max: 1440 }).toInt(),
  body('difficulty')
    .optional()
    .custom((val) =>
      (typeof val === 'string' && ['easy', 'medium', 'hard'].includes(val)) ||
      (Number.isInteger(val) && val >= 1 && val <= 3)
    ),
  body('resourceUrl').optional().isURL({ require_protocol: true }).trim(),
  body('resource').optional().isURL({ require_protocol: true }).trim(),
  body('benefits').optional().isArray({ max: 20 }),
  body('benefits.*').optional().isString().trim().isLength({ min: 1, max: 120 }),
  body('tips').optional().isArray({ max: 20 }),
  body('tips.*').optional().isString().trim().isLength({ min: 1, max: 120 }),
  body('tags').optional().isArray({ max: 20 }),
  body('tags.*').optional().isString().trim().isLength({ min: 1, max: 60 }),
];

export const idParamValidator = [param('id').isString().trim().notEmpty()];
