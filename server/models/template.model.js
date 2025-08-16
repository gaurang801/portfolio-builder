const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    templateName: {
        type: String,
        enum: ['template1', 'template2', 'template3', 'template4'],
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    // Enhanced fields for better functionality
    version: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    category: {
        type: String,
        enum: ['developer', 'designer', 'manager', 'student', 'freelancer', 'other'],
        default: 'other'
    },
    // Analytics and engagement
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    // Template relationships
    isTemplate: {
        type: Boolean,
        default: false // Distinguishes between user portfolios and reusable templates
    },
    parentTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        default: null
    },
    forkCount: {
        type: Number,
        default: 0
    },
    portfolioData: {
        personal: {
            fullName: { type: String, trim: true },
            title: { type: String, trim: true },
            bio: { type: String, trim: true },
            email: { type: String, trim: true },
            phone: { type: String, trim: true },
            location: { type: String, trim: true },
            website: { type: String, trim: true },
            linkedin: { type: String, trim: true },
            github: { type: String, trim: true },
            profileImage: { type: String, trim: true } // New field for profile images
        },
        experience: [{
            id: { type: String },
            jobTitle: { type: String, trim: true },
            company: { type: String, trim: true },
            startDate: { type: String, trim: true },
            endDate: { type: String, trim: true },
            current: { type: Boolean, default: false },
            description: { type: String, trim: true },
            skills: [{ type: String, trim: true }], // Skills used in this role
            achievements: [{ type: String, trim: true }] // Key achievements
        }],
        projects: [{
            id: { type: String },
            name: { type: String, trim: true },
            description: { type: String, trim: true },
            technologies: { type: String, trim: true },
            url: { type: String, trim: true },
            github: { type: String, trim: true },
            image: { type: String, trim: true }, // Project screenshot
            featured: { type: Boolean, default: false }, // Featured project flag
            dateCompleted: { type: String, trim: true }
        }],
        skills: [{
            id: { type: String },
            name: { type: String, trim: true },
            level: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                default: 'intermediate'
            },
            category: {
                type: String,
                enum: ['technical', 'soft', 'language', 'tool', 'framework', 'other'],
                default: 'technical'
            },
            yearsOfExperience: { type: Number, default: 0 }
        }],
        education: [{
            id: { type: String },
            degree: { type: String, trim: true },
            field: { type: String, trim: true },
            school: { type: String, trim: true },
            graduationYear: { type: String, trim: true },
            gpa: { type: String, trim: true },
            achievements: [{ type: String, trim: true }], // Academic achievements
            relevant: { type: Boolean, default: true } // Relevant to current career
        }],
        // New sections
        certifications: [{
            id: { type: String },
            name: { type: String, trim: true },
            issuer: { type: String, trim: true },
            dateIssued: { type: String, trim: true },
            expiryDate: { type: String, trim: true },
            credentialId: { type: String, trim: true },
            url: { type: String, trim: true }
        }],
        languages: [{
            id: { type: String },
            language: { type: String, trim: true },
            proficiency: {
                type: String,
                enum: ['basic', 'intermediate', 'advanced', 'native'],
                default: 'intermediate'
            }
        }]
    },
    customStyles: {
        primaryColor: { type: String, default: '#007bff' },
        secondaryColor: { type: String, default: '#6c757d' },
        accentColor: { type: String, default: '#28a745' },
        fontFamily: { type: String, default: 'Arial, sans-serif' },
        fontSize: { type: String, default: '16px' },
        backgroundColor: { type: String, default: '#ffffff' },
        textColor: { type: String, default: '#333333' },
        // Advanced styling options
        headerStyle: {
            background: { type: String, default: 'solid' }, // solid, gradient, image
            alignment: { type: String, default: 'center' }
        },
        layout: {
            maxWidth: { type: String, default: '1200px' },
            spacing: { type: String, default: 'normal' }, // compact, normal, spacious
            borderRadius: { type: String, default: '8px' }
        }
    },
    // SEO and sharing
    seo: {
        metaTitle: { type: String, trim: true },
        metaDescription: { type: String, trim: true },
        keywords: [{ type: String, trim: true }]
    },
    // Metadata for tracking and analytics
    metadata: {
        exportCount: { type: Number, default: 0 },
        lastExported: { type: Date, default: null },
        shareableLink: { type: String, default: null },
        lastViewed: { type: Date, default: Date.now },
        totalEditTime: { type: Number, default: 0 }, // in seconds
        deviceInfo: {
            lastDevice: { type: String, default: 'unknown' },
            lastBrowser: { type: String, default: 'unknown' },
            lastOS: { type: String, default: 'unknown' }
        },
        backupData: {
            autoBackupEnabled: { type: Boolean, default: true },
            lastBackup: { type: Date, default: null },
            backupCount: { type: Number, default: 0 }
        }
    }
}, {
    timestamps: true,
});

// Indexes for better query performance
templateSchema.index({ userId: 1, templateName: 1 });
templateSchema.index({ isPublic: 1 });
templateSchema.index({ status: 1 });
templateSchema.index({ category: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ views: -1 });
templateSchema.index({ likes: -1 });
templateSchema.index({ createdAt: -1 });

// Compound indexes
templateSchema.index({ isPublic: 1, status: 1, views: -1 });
templateSchema.index({ userId: 1, status: 1, updatedAt: -1 });

// Text search index
templateSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text',
    'portfolioData.personal.fullName': 'text',
    'portfolioData.personal.title': 'text'
});

// Pre-save middleware
templateSchema.pre('save', function (next) {
    // Auto-generate shareable link if template is public and doesn't have one
    if (this.isPublic && !this.metadata.shareableLink) {
        this.metadata.shareableLink = `/portfolio/${this._id}`;
    }

    // Update last viewed timestamp
    this.metadata.lastViewed = new Date();

    next();
});

// Methods
templateSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

templateSchema.methods.incrementLikes = function () {
    this.likes += 1;
    return this.save();
};

templateSchema.methods.incrementDownloads = function () {
    this.downloads += 1;
    this.metadata.exportCount += 1;
    this.metadata.lastExported = new Date();
    return this.save();
};

templateSchema.methods.createFork = function (newUserId) {
    const forkData = this.toObject();
    delete forkData._id;
    delete forkData.createdAt;
    delete forkData.updatedAt;

    forkData.userId = newUserId;
    forkData.parentTemplate = this._id;
    forkData.isPublic = false;
    forkData.views = 0;
    forkData.likes = 0;
    forkData.downloads = 0;
    forkData.version = 1;
    forkData.title = `Fork of ${this.title}`;

    // Increment fork count of parent
    this.forkCount += 1;
    this.save();

    return new this.constructor(forkData);
};

// Statics
templateSchema.statics.getPopularTemplates = function (limit = 10) {
    return this.find({ isPublic: true, status: 'published' })
        .sort({ views: -1, likes: -1 })
        .limit(limit)
        .populate('userId', 'name');
};

templateSchema.statics.searchTemplates = function (query, filters = {}) {
    const searchQuery = {
        isPublic: true,
        status: 'published',
        ...filters
    };

    if (query) {
        searchQuery.$text = { $search: query };
    }

    return this.find(searchQuery)
        .sort(query ? { score: { $meta: 'textScore' } } : { views: -1 })
        .populate('userId', 'name');
};

module.exports = mongoose.model("Template", templateSchema);