// backend/src/User-Registration-and-Login/controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../db");
const { uploadToSupabase } = require("../../supabase");
const { authenticateToken } = require("./middleware");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const signUp = async (req, res) => {
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
};

const signIn = async (req, res) => {
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
};

const getCurrentUser = [
  authenticateToken,
  async (req, res) => {
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
  },
];

module.exports = {
  signUp,
  signIn,
  getCurrentUser,
};
