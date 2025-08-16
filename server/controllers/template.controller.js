const Template = require('../models/template.model');
const Auth = require('../models/auth.model');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all templates for authenticated user
// @route   GET /api/templates
// @access  Private
const getTemplates = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        templateName,
        isPublic,
        status,
        category,
        sortBy = 'updatedAt',
        sortOrder = 'desc'
    } = req.query;

    const query = { userId: req.user._id };

    // Apply filters
    if (templateName) query.templateName = templateName;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    if (status) query.status = status;
    if (category) query.category = category;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const templates = await Template.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('userId', 'name email avatar')
        .populate('parentTemplate', 'title templateName');

    const total = await Template.countDocuments(query);

    res.status(200).json({
        success: true,
        count: templates.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        },
        data: templates
    });
});

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Private
const getTemplate = asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id)
        .populate('userId', 'name email avatar')
        .populate('parentTemplate', 'title templateName userId');

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    // Check if user owns the template or if it's public
    if (template.userId._id.toString() !== req.user._id.toString() && !template.isPublic) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this template'
        });
    }

    // Increment views if not the owner
    if (template.userId._id.toString() !== req.user._id.toString()) {
        await template.incrementViews();
    }

    res.status(200).json({
        success: true,
        data: template
    });
});

// @desc    Create new template
// @route   POST /api/templates
// @access  Private
const createTemplate = asyncHandler(async (req, res) => {
    const {
        templateName,
        title,
        description,
        portfolioData,
        customStyles,
        isPublic,
        category,
        tags,
        status = 'draft'
    } = req.body;

    // Validate required fields
    if (!templateName || !title) {
        return res.status(400).json({
            success: false,
            message: 'Template name and title are required'
        });
    }

    // Check if template name is valid
    const validTemplates = ['template1', 'template2', 'template3', 'template4'];
    if (!validTemplates.includes(templateName)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid template name. Must be one of: ' + validTemplates.join(', ')
        });
    }

    // Create template
    const template = await Template.create({
        userId: req.user._id,
        templateName,
        title,
        description: description || '',
        portfolioData: portfolioData || {},
        customStyles: customStyles || {},
        isPublic: isPublic || false,
        category: category || 'other',
        tags: tags || [],
        status
    });

    // Update user analytics
    const user = await Auth.findById(req.user._id);
    await user.incrementTemplateCount();

    // Populate user data before sending response
    await template.populate('userId', 'name email avatar');

    res.status(201).json({
        success: true,
        data: template,
        message: 'Template created successfully'
    });
});

// @desc    Update template (full update)
// @route   PUT /api/templates/:id
// @access  Private
const updateTemplate = asyncHandler(async (req, res) => {
    let template = await Template.findById(req.params.id);

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    // Check if user owns the template
    if (template.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this template'
        });
    }

    // Update version number
    const updateData = {
        ...req.body,
        version: template.version + 1
    };

    template = await Template.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).populate('userId', 'name email avatar');

    res.status(200).json({
        success: true,
        data: template,
        message: 'Template updated successfully'
    });
});

// @desc    Partially update template
// @route   PATCH /api/templates/:id
// @access  Private
const patchTemplate = asyncHandler(async (req, res) => {
    let template = await Template.findById(req.params.id);

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    // Check if user owns the template
    if (template.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this template'
        });
    }

    // Handle nested updates for portfolioData
    if (req.body.portfolioData) {
        template.portfolioData = {
            ...template.portfolioData.toObject(),
            ...req.body.portfolioData
        };
        template.markModified('portfolioData');
    }

    // Handle nested updates for customStyles
    if (req.body.customStyles) {
        template.customStyles = {
            ...template.customStyles.toObject(),
            ...req.body.customStyles
        };
        template.markModified('customStyles');
    }

    // Handle nested updates for metadata
    if (req.body.metadata) {
        template.metadata = {
            ...template.metadata.toObject(),
            ...req.body.metadata
        };
        template.markModified('metadata');
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
        if (!['portfolioData', 'customStyles', 'metadata'].includes(key)) {
            template[key] = req.body[key];
        }
    });

    await template.save();
    await template.populate('userId', 'name email avatar');

    res.status(200).json({
        success: true,
        data: template,
        message: 'Template updated successfully'
    });
});

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id);

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    // Check if user owns the template
    if (template.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this template'
        });
    }

    await template.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Template deleted successfully'
    });
});

// @desc    Get public templates
// @route   GET /api/templates/public
// @access  Public
const getPublicTemplates = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        templateName,
        category,
        search,
        sortBy = 'views',
        sortOrder = 'desc'
    } = req.query;

    const query = {
        isPublic: true,
        status: 'published'
    };

    if (templateName) query.templateName = templateName;
    if (category) query.category = category;

    // Text search
    if (search) {
        query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    if (search) {
        sortOptions.score = { $meta: 'textScore' };
    } else {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const templates = await Template.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('userId', 'name avatar')
        .select('-portfolioData.personal.email -portfolioData.personal.phone');

    const total = await Template.countDocuments(query);

    res.status(200).json({
        success: true,
        count: templates.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        },
        data: templates
    });
});

// @desc    Fork a public template
// @route   POST /api/templates/:id/fork
// @access  Private
const forkTemplate = asyncHandler(async (req, res) => {
    const originalTemplate = await Template.findById(req.params.id);

    if (!originalTemplate) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    if (!originalTemplate.isPublic) {
        return res.status(403).json({
            success: false,
            message: 'Cannot fork private template'
        });
    }

    // Create fork
    const forkedTemplate = originalTemplate.createFork(req.user._id);
    await forkedTemplate.save();

    // Update user analytics
    const user = await Auth.findById(req.user._id);
    await user.incrementTemplateCount();

    await forkedTemplate.populate('userId', 'name email avatar');

    res.status(201).json({
        success: true,
        data: forkedTemplate,
        message: 'Template forked successfully'
    });
});

// @desc    Like/Unlike template
// @route   POST /api/templates/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id);

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    if (!template.isPublic) {
        return res.status(403).json({
            success: false,
            message: 'Cannot like private template'
        });
    }

    // For simplicity, just increment likes (in real app, track user likes)
    await template.incrementLikes();

    res.status(200).json({
        success: true,
        data: { likes: template.likes },
        message: 'Template liked'
    });
});

// @desc    Get template analytics
// @route   GET /api/templates/:id/analytics
// @access  Private
const getTemplateAnalytics = asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id);

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    // Check if user owns the template
    if (template.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to view analytics'
        });
    }

    const analytics = {
        views: template.views,
        likes: template.likes,
        downloads: template.downloads,
        forkCount: template.forkCount,
        exportCount: template.metadata.exportCount,
        lastExported: template.metadata.lastExported,
        createdAt: template.createdAt,
        lastViewed: template.metadata.lastViewed
    };

    res.status(200).json({
        success: true,
        data: analytics
    });
});

// @desc    Export template (track download)
// @route   POST /api/templates/:id/export
// @access  Private
const exportTemplate = asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id);

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found'
        });
    }

    // Check if user owns the template or if it's public
    if (template.userId.toString() !== req.user._id.toString() && !template.isPublic) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to export this template'
        });
    }

    // Track export
    await template.incrementDownloads();

    // Update user analytics if they're exporting their own template
    if (template.userId.toString() === req.user._id.toString()) {
        const user = await Auth.findById(req.user._id);
        await user.updateExportAnalytics();
    }

    res.status(200).json({
        success: true,
        message: 'Export tracked successfully',
        data: {
            downloadCount: template.downloads,
            exportCount: template.metadata.exportCount
        }
    });
});

module.exports = {
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    patchTemplate,
    deleteTemplate,
    getPublicTemplates,
    forkTemplate,
    toggleLike,
    getTemplateAnalytics,
    exportTemplate
};