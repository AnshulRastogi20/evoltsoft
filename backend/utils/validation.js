const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Charging station validation rules
const validateChargingStation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Station name must be between 2 and 100 characters'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array with exactly 2 elements'),
  body('location.coordinates.*')
    .isNumeric()
    .withMessage('Coordinates must be numeric'),
  body('location.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Maintenance'])
    .withMessage('Status must be Active, Inactive, or Maintenance'),
  body('powerOutput')
    .isNumeric({ min: 1, max: 1000 })
    .withMessage('Power output must be between 1 and 1000 kW'),
  body('connectorType')
    .isIn(['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'])
    .withMessage('Invalid connector type'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('pricePerKWh')
    .optional()
    .isNumeric({ min: 0 })
    .withMessage('Price per kWh must be a positive number'),
  handleValidationErrors
];

// Parameter validation
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Query validation for filtering
const validateStationQuery = [
  query('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Maintenance'])
    .withMessage('Invalid status filter'),
  query('connectorType')
    .optional()
    .isIn(['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'])
    .withMessage('Invalid connector type filter'),
  query('minPower')
    .optional()
    .isNumeric({ min: 0 })
    .withMessage('Minimum power must be a positive number'),
  query('maxPower')
    .optional()
    .isNumeric({ min: 0 })
    .withMessage('Maximum power must be a positive number'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateChargingStation,
  validateObjectId,
  validateStationQuery,
  handleValidationErrors
};
