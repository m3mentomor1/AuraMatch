// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import route modules
const authRoutes = require("./src/User-Registration-and-Login/routes");
const profileRoutes = require("./src/User-Profile-Management/routes");
const matchingRoutes = require("./src/User-Discovery-and-Matching/routes");
const messagingRoutes = require("./src/Messaging-Chat/routes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix proxy / rate limit issues on Render
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ✅ Generic API rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased from 100 to reduce false blocking
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// ✅ Auth-specific rate limiter (less strict now)
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // increased from 5
  message: "Too many authentication attempts, please try again later.",
});
app.use("/api/auth/signin", authLimiter);
app.use("/api/auth/signup", authLimiter);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", matchingRoutes);
app.use("/api", messagingRoutes);

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "AuraMatch API",
    version: "1.0.0",
    status: "active",
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const errorMessage =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(err.status || 500).json({
    error: errorMessage,
  });
});

// ✅ Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
