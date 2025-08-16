const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Enhanced fields for better UX
    avatar: {
        type: String,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginCount: {
        type: Number,
        default: 0
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        },
        notifications: {
            type: Boolean,
            default: true
        },
        autoSave: {
            type: Boolean,
            default: true
        },
        autoSaveInterval: {
            type: Number,
            default: 30000 // 30 seconds
        }
    },
    socialProviders: {
        google: {
            id: { type: String, default: null },
            email: { type: String, default: null }
        },
        github: {
            id: { type: String, default: null },
            username: { type: String, default: null }
        },
        linkedin: {
            id: { type: String, default: null },
            email: { type: String, default: null }
        }
    },
    // Usage analytics
    analytics: {
        templatesCreated: { type: Number, default: 0 },
        totalExports: { type: Number, default: 0 },
        lastExportDate: { type: Date, default: null },
        favoriteTemplate: { type: String, default: null }
    }
}, {
    timestamps: true,
});

// Indexes for better performance
authSchema.index({ email: 1 });
authSchema.index({ emailVerificationToken: 1 });
authSchema.index({ passwordResetToken: 1 });
authSchema.index({ 'socialProviders.google.id': 1 });
authSchema.index({ 'socialProviders.github.id': 1 });
authSchema.index({ 'socialProviders.linkedin.id': 1 });

// Pre-save middleware to increment login count
authSchema.pre('save', function (next) {
    if (this.isModified('lastLogin') && !this.isNew) {
        this.loginCount += 1;
    }
    next();
});

// Method to increment template count
authSchema.methods.incrementTemplateCount = function () {
    this.analytics.templatesCreated += 1;
    return this.save();
};

// Method to update export analytics
authSchema.methods.updateExportAnalytics = function () {
    this.analytics.totalExports += 1;
    this.analytics.lastExportDate = new Date();
    return this.save();
};

module.exports = mongoose.model("Auth", authSchema);