// backend/src/User-Profile-Management/routes.js
const express = require("express");
const router = express.Router();
const profileController = require("./controller");
const {
  authenticateToken,
  upload,
} = require("../User-Registration-and-Login/middleware");

// Update user profile
router.put(
  "/auth/profile",
  authenticateToken,
  upload.single("profilePicture"),
  profileController.updateProfile
);

module.exports = router;
