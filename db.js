// backend/db.js
const { Pool } = require("pg");

// Only use SSL in production (Render)
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("✅ Database connected successfully");
  }
});

module.exports = pool;
