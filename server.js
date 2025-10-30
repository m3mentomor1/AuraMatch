require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

// Import route modules
const authRoutes = require("./src/User-Registration-and-Login/routes");
const profileRoutes = require("./src/User-Profile-Management/routes");
const matchingRoutes = require("./src/User-Discovery-and-Matching/routes");
const messagingRoutes = require("./src/Messaging-Chat/routes");

const app = express();
const server = http.createServer(app); // ✅ create HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT;
app.set("trust proxy", 1);

// ✅ SOCKET.IO HANDLERS -----
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // User joins private room based on match ID
  socket.on("join_room", (room) => {
    socket.join(room);
  });

  // When a new chat message arrives
  socket.on("new_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Security middleware
app.use(helmet());

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limit
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", matchingRoutes);
app.use("/api", messagingRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on ${PORT}`);
});
