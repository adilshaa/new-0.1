const express = require("express");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Proto = require("./models/prototype");
const User = require("../../models/user");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 5 requests per window
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

// Login component


app.post(
  "/basic/register",
  loginLimiter,
  [
    // Validate and sanitize inputs
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body, "it body");

    const { email, password } = req.body;
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const inserting = await new User({
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      if (inserting == null) return res.json({ error: "error" });

      await inserting.save();
      return res
        .status(200)
        .json({ status: "succes", msg: "Registration successed" });
    } catch (error) {
      return res.json({ status: "error", msg: error });
    }
  }
);

app.post(
  "/basic/login",
  loginLimiter,
  [
    // Validate and sanitize inputs
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "No record found" });
      }

      let isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ msg: "Authentication faild" });
      }

      await User.findOneAndUpdate({ _id: user._id }, { updatedAt: new Date() });

      return res.status(200).json({ status: 200, msg: "Login success" });
    } catch (error) {
      return res.json({ status: "error", msg: error });
    }
  }
);
