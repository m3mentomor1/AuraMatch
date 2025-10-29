// backend/src/Messaging-Chat/routes.js
const express = require("express");
const router = express.Router();
const messagingController = require("./controller");
const {
  authenticateToken,
} = require("../User-Registration-and-Login/middleware");

// Get messages for a match
router.get(
  "/matches/:matchId/messages",
  authenticateToken,
  messagingController.getMessages
);

// Send a message
router.post(
  "/matches/:matchId/messages",
  authenticateToken,
  messagingController.sendMessage
);

// Get unread message count
router.get(
  "/messages/unread-count",
  authenticateToken,
  messagingController.getUnreadCount
);

module.exports = router;
