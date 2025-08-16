const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB ${mongoose.connection}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};