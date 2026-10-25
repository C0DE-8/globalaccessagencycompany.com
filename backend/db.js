// db.js
require("dotenv").config();
const mysql = require("mysql2");

// Create a promise‐based pool using ENV
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: log connection once (safe)
pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected to:", process.env.DB_NAME);
    conn.release();
  }
});

// Export promise pool
module.exports = pool.promise();
