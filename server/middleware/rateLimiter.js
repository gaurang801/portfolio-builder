const rateLimit = require('express-rate-limit');

// Custom key generator to handle IPv6 issues
const customKeyGenerator = (req) => {
    // Get the IP address, handling both IPv4 and IPv6
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;

    // Normalize IPv6 addresses
    if (ip && ip.includes('::ffff:')) {
        return ip.replace('::ffff:', ''); // Convert IPv4-mapped IPv6 to IPv4
    }

    return ip || 'unknown';
};

// Auth related rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: customKeyGenerator, // Add this
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply the same keyGenerator to all other limiters
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: customKeyGenerator, // Add this
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const publicApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    keyGenerator: customKeyGenerator, // Add this
    message: {
        success: false,
        message: 'Too many requests to public API, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const templateCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: customKeyGenerator, // Add this
    message: {
        success: false,
        message: 'Too many templates created, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const templateInteractionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    keyGenerator: customKeyGenerator, // Add this
    message: {
        success: false,
        message: 'Too many template interactions, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    apiLimiter,
    publicApiLimiter,
    templateCreationLimiter,
    templateInteractionLimiter
};