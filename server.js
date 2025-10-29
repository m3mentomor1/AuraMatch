// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import route modules
const authRoutes = require("./src/User-Registration-and-Login/routes");
const profileRoutes = require("./src/User-Profile-Management/routes");
const matchingRoutes = require("./src/User-Discovery-and-Matching/routes");
const messagingRoutes = require("./src/Messaging-Chat/routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", matchingRoutes);
app.use("/api", messagingRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
