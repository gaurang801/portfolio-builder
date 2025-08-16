const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

// Auth validations
const validateAuth = {
    signup: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name can only contain letters and spaces'),

        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

        handleValidationErrors
    ],

    login: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),

        body('password')
            .notEmpty()
            .withMessage('Password is required'),

        handleValidationErrors
    ],

    forgotPassword: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),

        handleValidationErrors
    ],

    resetPassword: [
        param('token')
            .isLength({ min: 32, max: 128 })
            .withMessage('Invalid reset token'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

        handleValidationErrors
    ],

    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),

        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),

        handleValidationErrors
    ],

    deleteAccount: [
        body('password')
            .notEmpty()
            .withMessage('Password is required to delete account'),

        handleValidationErrors
    ]
};

// Profile validations
const validateProfile = {
    updateProfile: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name can only contain letters and spaces'),

        body('email')
            .optional()
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),

        body('avatar')
            .optional()
            .isURL()
            .withMessage('Avatar must be a valid URL'),

        body('preferences.theme')
            .optional()
            .isIn(['light', 'dark', 'auto'])
            .withMessage('Theme must be light, dark, or auto'),

        body('preferences.notifications')
            .optional()
            .isBoolean()
            .withMessage('Notifications setting must be boolean'),

        body('preferences.autoSave')
            .optional()
            .isBoolean()
            .withMessage('Auto save setting must be boolean'),

        handleValidationErrors
    ]
};

// Template validations
const validateTemplate = {
    createTemplate: [
        body('templateName')
            .isIn(['template1', 'template2', 'template3', 'template4'])
            .withMessage('Invalid template name'),

        body('title')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be between 1 and 100 characters'),

        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),

        body('category')
            .optional()
            .isIn(['developer', 'designer', 'manager', 'student', 'freelancer', 'other'])
            .withMessage('Invalid category'),

        body('isPublic')
            .optional()
            .isBoolean()
            .withMessage('isPublic must be boolean'),

        body('tags')
            .optional()
            .isArray({ max: 10 })
            .withMessage('Tags must be an array with maximum 10 items'),

        body('tags.*')
            .optional()
            .trim()
            .isLength({ min: 1, max: 30 })
            .withMessage('Each tag must be between 1 and 30 characters'),

        handleValidationErrors
    ],

    updateTemplate: [
        param('id')
            .isMongoId()
            .withMessage('Invalid template ID'),

        body('templateName')
            .optional()
            .isIn(['template1', 'template2', 'template3', 'template4'])
            .withMessage('Invalid template name'),

        body('title')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be between 1 and 100 characters'),

        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),

        handleValidationErrors
    ],

    patchTemplate: [
        param('id')
            .isMongoId()
            .withMessage('Invalid template ID'),

        // Less strict validation for partial updates
        body('title')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be between 1 and 100 characters'),

        handleValidationErrors
    ]
};

// Query validations
const validateQuery = {
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),

        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),

        handleValidationErrors
    ]
};

module.exports = {
    validateAuth,
    validateProfile,
    validateTemplate,
    validateQuery,
    handleValidationErrors
};