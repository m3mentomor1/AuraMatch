// backend/src/User-Registration-and-Login/routes.js
const express = require("express");
const router = express.Router();
const authController = require("./controller");
const { upload } = require("./middleware");

// Sign Up
router.post("/signup", upload.single("profilePicture"), authController.signUp);

// Sign In
router.post("/signin", authController.signIn);

// Get current user
router.get("/me", authController.getCurrentUser);

module.exports = router;
