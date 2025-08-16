const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const colors = require('colors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoute = require('./routes/auth.route');
const templateRoute = require('./routes/template.route');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const connectDB = require('./config/config');

const app = express();

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
        : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['tags', 'skills'] // Allow arrays for these parameters
}));

// Compression middleware
app.use(compression());

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Static files (for serving portfolio previews if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));


// Connect to database
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Portfolio Builder API",
        version: "1.0.0",
        documentation: "/api/docs",
        endpoints: {
            auth: "/api/auth",
            templates: "/api/templates",
            health: "/health"
        }
    });
});

// API routes
app.use("/api/auth", authRoute);
app.use("/api/templates", templateRoute);

// Handle 404 for API routes
app.all('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler middleware (should be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Unhandled Rejection: ${err.message}`.red.bold);
    // Close server & exit process
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`.red.bold);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
    🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
    📡 Port: ${PORT}
    🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
    🌐 CORS: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
    ⚡ Ready to accept connections!
    `.green.bold);
});

// Handle server errors
server.on('error', (error) => {
    console.error(`Server error: ${error.message}`.red.bold);
});

module.exports = app;