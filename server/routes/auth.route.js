const express = require("express");
const Auth = require("../models/auth.mode");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/signup", async(req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password do not match",
        });
    }
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Auth.create({ name, email, password: hashedPassword });
    res.status(201).json({
        success: true,
        user,
    });
});

router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email, password });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        user,
    });
});

module.exports = router;