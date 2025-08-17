const express = require('express');
const {
    signup,
    login,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getUserAnalytics,
    deleteAccount
} = require('../controllers/auth.controller');
const authHandler = require('../middleware/authHandler');
const rateLimiter = require('../middleware/rateLimiter');
const { validateAuth, validateProfile } = require('../middleware/validation');

const router = express.Router();

// Public routes with rate limiting
router.post('/signup', rateLimiter.authLimiter, validateAuth.signup, signup);
router.post('/login', rateLimiter.authLimiter, validateAuth.login, login);
router.post('/forgot-password', rateLimiter.authLimiter, validateAuth.forgotPassword, forgotPassword);
router.put('/reset-password/:token', rateLimiter.authLimiter, validateAuth.resetPassword, resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(authHandler); // Apply auth middleware to all routes below

router.get('/me', getMe);
router.put('/profile', validateProfile.updateProfile, updateProfile);
router.put('/change-password', validateAuth.changePassword, changePassword);
router.get('/analytics', getUserAnalytics);
router.delete('/account', validateAuth.deleteAccount, deleteAccount);

module.exports = router;