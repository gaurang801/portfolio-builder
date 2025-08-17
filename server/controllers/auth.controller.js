const Auth = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail'); // You'll need to create this

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Enhanced validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide name, email and password'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    // Check if user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await Auth.create({
        name,
        email,
        password: hashedPassword,
        emailVerificationToken,
        loginCount: 1,
        lastLogin: new Date()
    });


    // Generate JWT token
    const token = generateToken(user._id);

    await user.save();

    // Send verification email (optional - can be implemented later)
    await sendVerificationEmail(user, emailVerificationToken);

    res.status(201).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            preferences: user.preferences,
            analytics: user.analytics
        },
        message: 'Account created successfully! Please verify your email.'
    });
});

const sendVerificationEmail = async (user, verificationToken) => {
    const subject = 'Verify your email address';
    const text = `Please verify your email address by clicking this link: ${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await sendEmail(user.email, subject, text);
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    }

    // Check if user exists and get password
    const user = await Auth.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // Check if account is active
    if (!user.isActive) {
        return res.status(401).json({
            success: false,
            message: 'Account has been deactivated. Please contact support.'
        });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // Update login analytics
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate token with different expiry based on rememberMe
    const tokenExpiry = rememberMe ? '30d' : '24h';
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: tokenExpiry
    });

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            preferences: user.preferences,
            analytics: user.analytics,
            lastLogin: user.lastLogin,
            avatar: user.avatar
        },
        message: 'Login successful'
    });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await Auth.findById(req.user.id).select('-password');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
            preferences: user.preferences,
            analytics: user.analytics,
            socialProviders: user.socialProviders,
            avatar: user.avatar,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        }
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, avatar, preferences } = req.body;

    const user = await Auth.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        user.emailVerified = false; // Reset verification if email changes
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
    }

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        user: {
            id: updatedUser._id,
            username: updatedUser.name,
            email: updatedUser.email,
            emailVerified: updatedUser.emailVerified,
            preferences: updatedUser.preferences,
            avatar: updatedUser.avatar
        },
        message: 'Profile updated successfully'
    });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please provide current password and new password'
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'New password must be at least 6 characters long'
        });
    }

    const user = await Auth.findById(req.user.id).select('+password');

    // Check current password
    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordMatch) {
        return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
        });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email address'
        });
    }

    const user = await Auth.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No user found with this email address'
        });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send password reset email (implement sendEmail utility)
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
        success: true,
        message: 'Password reset email sent',
        // In development, return token (remove in production)
        ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
});

const sendPasswordResetEmail = async (user, resetToken) => {
    const subject = 'Reset your password';
    const text = `Please reset your password by clicking this link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(user.email, subject, text);
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide new password'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    const user = await Auth.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired password reset token'
        });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Generate new JWT token
    const jwtToken = generateToken(user._id);

    res.status(200).json({
        success: true,
        token: jwtToken,
        message: 'Password reset successful'
    });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await Auth.findOne({ emailVerificationToken: token });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email verification token'
        });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully'
    });
});

// @desc    Get user analytics
// @route   GET /api/auth/analytics
// @access  Private
const getUserAnalytics = asyncHandler(async (req, res) => {
    const user = await Auth.findById(req.user.id).select('analytics');

    res.status(200).json({
        success: true,
        analytics: user.analytics
    });
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide your password to confirm account deletion'
        });
    }

    const user = await Auth.findById(req.user.id).select('+password');

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect password'
        });
    }

    // Soft delete - just deactivate the account
    user.isActive = false;
    await user.save();

    // Also need to handle user's templates (mark as archived or delete)
    // This would be implemented based on business requirements

    res.status(200).json({
        success: true,
        message: 'Account has been deactivated successfully'
    });
});

module.exports = {
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
};