const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio-builder', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.green.bold);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`Database error: ${err}`.red);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Database disconnected'.yellow);
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Database reconnected'.green);
        });

    } catch (error) {
        console.error(`Database connection failed: ${error.message}`.red.bold);
        process.exit(1);
    }
};

module.exports = connectDB