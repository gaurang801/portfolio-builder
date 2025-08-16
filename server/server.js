const express = require("express");
require("dotenv").config();
const authRoute = require("./routes/auth.route");
const connectDB = require("./config/config");
const app = express();

// connect DB
connectDB();

app.get("/", (req, res) => {
    res.send("<h1>Heyy</h1>");
});

const PORT = process.env.PORT || 8080;

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});