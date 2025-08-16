const express = require('express');
const {
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
} = require('../controllers/template.controller');
const authHandler = require('../middleware/authHandler');
const rateLimiter = require('../middleware/rateLimiter');
const { validateTemplate } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/public', rateLimiter.publicApiLimiter, getPublicTemplates);

// Protected routes
router.use(authHandler); // Apply auth middleware to all routes below

// Template CRUD operations
router.route('/')
    .get(getTemplates)
    .post(rateLimiter.templateCreationLimiter, validateTemplate.createTemplate, createTemplate);

router.route('/:id')
    .get(getTemplate)
    .put(validateTemplate.updateTemplate, updateTemplate)
    .patch(validateTemplate.patchTemplate, patchTemplate)
    .delete(deleteTemplate);

// Template interactions
router.post('/:id/fork', rateLimiter.templateInteractionLimiter, forkTemplate);
router.post('/:id/like', rateLimiter.templateInteractionLimiter, toggleLike);
router.post('/:id/export', rateLimiter.templateInteractionLimiter, exportTemplate);

// Template analytics
router.get('/:id/analytics', getTemplateAnalytics);

module.exports = router;