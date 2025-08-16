const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB ${mongoose.connection.name}`);
    } catch (error) {
        console.log("error", error);
        process.exit(1);
    }
};

module.exports = connectDB