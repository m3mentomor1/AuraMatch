// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const pool = require("./db");
const supabase = require("./supabase");
const { uploadToSupabase, deleteFromSupabase } = require("./supabase");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage (we'll upload to Supabase instead of disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Sign Up
app.post(
  "/api/auth/signup",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { email, password, firstName, lastName, age, bio } = req.body;

      if (!email || !password || !firstName || !age) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Profile picture is required" });
      }

      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload to Supabase
      const profilePictureUrl = await uploadToSupabase(req.file);

      const result = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, age, bio, profile_picture) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, first_name, last_name, age, bio, profile_picture, created_at`,
        [
          email,
          hashedPassword,
          firstName,
          lastName || null,
          parseInt(age),
          bio || null,
          profilePictureUrl,
        ]
      );

      const user = result.rows[0];

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({
        message: "Account created successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          age: user.age,
          bio: user.bio,
          profilePicture: user.profile_picture,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Server error during signup" });
    }
  }
);

// Sign In
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Signed in successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        age: user.age,
        bio: user.bio,
        profilePicture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Server error during signin" });
  }
});

// Get current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, age, bio, profile_picture, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      age: user.age,
      bio: user.bio,
      profilePicture: user.profile_picture,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
app.put(
  "/api/auth/profile",
  authenticateToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { firstName, lastName, age, bio } = req.body;

      if (!firstName || !age) {
        return res
          .status(400)
          .json({ error: "First name and age are required" });
      }

      let updateFields = [];
      let updateValues = [];
      let paramCount = 1;

      updateFields.push(`first_name = $${paramCount}`);
      updateValues.push(firstName);
      paramCount++;

      updateFields.push(`last_name = $${paramCount}`);
      updateValues.push(lastName || null);
      paramCount++;

      updateFields.push(`age = $${paramCount}`);
      updateValues.push(parseInt(age));
      paramCount++;

      updateFields.push(`bio = $${paramCount}`);
      updateValues.push(bio || null);
      paramCount++;

      // If new profile picture uploaded
      if (req.file) {
        // Get old profile picture URL
        const oldUser = await pool.query(
          "SELECT profile_picture FROM users WHERE id = $1",
          [req.user.id]
        );

        if (oldUser.rows.length > 0) {
          const oldPictureUrl = oldUser.rows[0].profile_picture;
          // Delete old file from Supabase
          await deleteFromSupabase(oldPictureUrl);
        }

        // Upload new file to Supabase
        const newProfilePictureUrl = await uploadToSupabase(req.file);

        updateFields.push(`profile_picture = $${paramCount}`);
        updateValues.push(newProfilePictureUrl);
        paramCount++;
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(req.user.id);

      const query = `
        UPDATE users 
        SET ${updateFields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING id, email, first_name, last_name, age, bio, profile_picture, updated_at
      `;

      const result = await pool.query(query, updateValues);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = result.rows[0];

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          age: user.age,
          bio: user.bio,
          profilePicture: user.profile_picture,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get all users
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.age, u.bio, u.profile_picture 
       FROM users u
       WHERE u.id != $1 
       AND u.id NOT IN (
         SELECT swiped_user_id FROM swipes WHERE user_id = $1
       )
       ORDER BY u.created_at DESC`,
      [req.user.id]
    );

    const users = result.rows.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      age: user.age,
      bio: user.bio,
      profilePicture: user.profile_picture,
    }));

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Record a swipe
app.post("/api/swipes", authenticateToken, async (req, res) => {
  try {
    const { swipedUserId, swipeType } = req.body;

    if (!swipedUserId || !swipeType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["like", "pass"].includes(swipeType)) {
      return res.status(400).json({ error: "Invalid swipe type" });
    }

    // Record the swipe
    await pool.query(
      `INSERT INTO swipes (user_id, swiped_user_id, swipe_type) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, swiped_user_id) 
       DO UPDATE SET swipe_type = $3, created_at = CURRENT_TIMESTAMP`,
      [req.user.id, swipedUserId, swipeType]
    );

    let isMatch = false;
    let matchId = null;

    // Check if it's a mutual like
    if (swipeType === "like") {
      const mutualLike = await pool.query(
        `SELECT * FROM swipes 
         WHERE user_id = $1 AND swiped_user_id = $2 AND swipe_type = 'like'`,
        [swipedUserId, req.user.id]
      );

      if (mutualLike.rows.length > 0) {
        isMatch = true;

        // Create match record
        const matchResult = await pool.query(
          `INSERT INTO matches (user_id, matched_user_id) 
           VALUES ($1, $2), ($2, $1)
           ON CONFLICT (user_id, matched_user_id) DO NOTHING
           RETURNING id`,
          [req.user.id, swipedUserId]
        );

        if (matchResult.rows.length > 0) {
          matchId = matchResult.rows[0].id;
        }
      }
    }

    res.json({
      message: "Swipe recorded successfully",
      isMatch,
      matchId,
    });
  } catch (error) {
    console.error("Swipe error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's matches
app.get("/api/matches", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         u.id, u.first_name, u.last_name, u.age, u.bio, u.profile_picture,
         m.created_at as matched_at,
         m.id as match_id,
         m.user_id as match_user_id,
         m.matched_user_id as match_matched_user_id
       FROM matches m
       JOIN users u ON m.matched_user_id = u.id
       WHERE m.user_id = $1
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );

    // For each match, get message stats
    const matchesWithStats = await Promise.all(
      result.rows.map(async (match) => {
        // Find reverse match ID
        const reverseMatch = await pool.query(
          `SELECT id FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
          [match.match_matched_user_id, match.match_user_id]
        );

        const reverseMatchId =
          reverseMatch.rows.length > 0 ? reverseMatch.rows[0].id : null;

        // Get unread count
        const unreadResult = await pool.query(
          `SELECT COUNT(*) as count FROM messages 
           WHERE (match_id = $1 ${reverseMatchId ? "OR match_id = $2" : ""})
           AND sender_id = $3 AND read = false`,
          reverseMatchId
            ? [match.match_id, reverseMatchId, match.id]
            : [match.match_id, match.id]
        );

        // Get last message
        const lastMessageResult = await pool.query(
          `SELECT message, created_at FROM messages 
           WHERE match_id = $1 ${reverseMatchId ? "OR match_id = $2" : ""}
           ORDER BY created_at DESC LIMIT 1`,
          reverseMatchId ? [match.match_id, reverseMatchId] : [match.match_id]
        );

        return {
          id: match.id,
          matchId: match.match_id,
          firstName: match.first_name,
          lastName: match.last_name,
          age: match.age,
          bio: match.bio,
          profilePicture: match.profile_picture,
          matchedAt: match.matched_at,
          unreadCount: parseInt(unreadResult.rows[0].count) || 0,
          lastMessage:
            lastMessageResult.rows.length > 0
              ? lastMessageResult.rows[0].message
              : null,
          lastMessageTime:
            lastMessageResult.rows.length > 0
              ? lastMessageResult.rows[0].created_at
              : null,
        };
      })
    );

    // Sort by most recent message
    matchesWithStats.sort((a, b) => {
      const timeA = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : new Date(a.matchedAt).getTime();
      const timeB = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : new Date(b.matchedAt).getTime();
      return timeB - timeA;
    });

    res.json(matchesWithStats);
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get messages for a match
app.get(
  "/api/matches/:matchId/messages",
  authenticateToken,
  async (req, res) => {
    try {
      const { matchId } = req.params;

      // First, get the match details to find both users
      const matchInfo = await pool.query(
        `SELECT user_id, matched_user_id FROM matches WHERE id = $1`,
        [matchId]
      );

      if (matchInfo.rows.length === 0) {
        return res.status(404).json({ error: "Match not found" });
      }

      const match = matchInfo.rows[0];
      const user1 = match.user_id;
      const user2 = match.matched_user_id;

      // Verify current user is part of this match
      if (user1 !== req.user.id && user2 !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Find the reverse match ID
      const reverseMatch = await pool.query(
        `SELECT id FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
        [user2, user1]
      );

      const reverseMatchId =
        reverseMatch.rows.length > 0 ? reverseMatch.rows[0].id : null;

      // Get all messages from both match records
      const result = await pool.query(
        `SELECT m.*, u.first_name, u.profile_picture
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.match_id = $1 ${reverseMatchId ? "OR m.match_id = $2" : ""}
       ORDER BY m.created_at ASC`,
        reverseMatchId ? [matchId, reverseMatchId] : [matchId]
      );

      // Mark all messages in this conversation as read for the current user
      await pool.query(
        `UPDATE messages SET read = true 
       WHERE (match_id = $1 ${reverseMatchId ? "OR match_id = $2" : ""})
       AND sender_id != $3`,
        reverseMatchId
          ? [matchId, reverseMatchId, req.user.id]
          : [matchId, req.user.id]
      );

      const messages = result.rows.map((msg) => ({
        id: msg.id,
        message: msg.message,
        senderId: msg.sender_id,
        senderName: msg.first_name,
        senderPicture: msg.profile_picture,
        createdAt: msg.created_at,
        read: msg.read,
      }));

      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Send a message
app.post(
  "/api/matches/:matchId/messages",
  authenticateToken,
  async (req, res) => {
    try {
      const { matchId } = req.params;
      const { message } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      // Get the match details
      const matchInfo = await pool.query(
        `SELECT user_id, matched_user_id FROM matches WHERE id = $1`,
        [matchId]
      );

      if (matchInfo.rows.length === 0) {
        return res.status(404).json({ error: "Match not found" });
      }

      const match = matchInfo.rows[0];

      // Verify current user is part of this match
      if (
        match.user_id !== req.user.id &&
        match.matched_user_id !== req.user.id
      ) {
        return res
          .status(403)
          .json({ error: "Access denied - Not a valid match" });
      }

      // Insert message with the provided matchId
      const result = await pool.query(
        `INSERT INTO messages (match_id, sender_id, message) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
        [matchId, req.user.id, message.trim()]
      );

      const newMessage = result.rows[0];

      res.status(201).json({
        id: newMessage.id,
        message: newMessage.message,
        senderId: newMessage.sender_id,
        createdAt: newMessage.created_at,
        read: newMessage.read,
      });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get unread message count
app.get("/api/messages/unread-count", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(DISTINCT msg.id) as unread_count
       FROM messages msg
       JOIN matches m ON msg.match_id = m.id
       WHERE (m.user_id = $1 OR m.matched_user_id = $1) 
       AND msg.sender_id != $1 
       AND msg.read = false`,
      [req.user.id]
    );

    res.json({
      unreadCount: parseInt(result.rows[0].unread_count) || 0,
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Unmatch a user
app.delete("/api/matches/:matchId", authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.params;

    // Get the match details
    const matchInfo = await pool.query(
      `SELECT user_id, matched_user_id FROM matches WHERE id = $1`,
      [matchId]
    );

    if (matchInfo.rows.length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }

    const match = matchInfo.rows[0];

    // Verify current user is part of this match
    if (
      match.user_id !== req.user.id &&
      match.matched_user_id !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Find the reverse match
    const reverseMatch = await pool.query(
      `SELECT id FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
      [match.matched_user_id, match.user_id]
    );

    const reverseMatchId =
      reverseMatch.rows.length > 0 ? reverseMatch.rows[0].id : null;

    // Delete all messages associated with both matches
    await pool.query(
      `DELETE FROM messages WHERE match_id = $1 ${
        reverseMatchId ? "OR match_id = $2" : ""
      }`,
      reverseMatchId ? [matchId, reverseMatchId] : [matchId]
    );

    // Delete both match records (bidirectional)
    await pool.query(
      `DELETE FROM matches WHERE id = $1 ${reverseMatchId ? "OR id = $2" : ""}`,
      reverseMatchId ? [matchId, reverseMatchId] : [matchId]
    );

    res.json({ message: "Unmatched successfully" });
  } catch (error) {
    console.error("Unmatch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
