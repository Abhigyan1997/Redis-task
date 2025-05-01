import { body } from 'express-validator';

export const validateCreateTask = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Status must be one of pending, in-progress, done'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),

  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('assignedTo must be a valid MongoDB ID'),
];
