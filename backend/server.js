const dotenv = require("dotenv");
dotenv.config(); // ✅ load env FIRST

const express = require("express");
const cors = require("cors");

const packageRoutes = require("./routes/packageRoutes");
const authRoutes = require("./routes/authRoutes");
require("./db"); // ✅ ensure DB initializes after env is loaded

const app = express();
const PORT = process.env.PORT || 5009;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to the Package Shipping API" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ DB: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);
});
