// backend/src/User-Discovery-and-Matching/routes.js
const express = require("express");
const router = express.Router();
const matchingController = require("./controller");
const {
  authenticateToken,
} = require("../User-Registration-and-Login/middleware");

// Get all available users to swipe
router.get("/users", authenticateToken, matchingController.getAvailableUsers);

// Record a swipe
router.post("/swipes", authenticateToken, matchingController.recordSwipe);

// Get user's matches
router.get("/matches", authenticateToken, matchingController.getMatches);

// Unmatch a user
router.delete(
  "/matches/:matchId",
  authenticateToken,
  matchingController.unmatchUser
);

module.exports = router;
