// routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// ✅ Use ENV secrets (no hardcoding)
const JWT_SECRET = String(process.env.JWT_SECRET || "").trim();
const ADMIN_KEY_CODE = String(process.env.ADMIN_KEY_CODE || "112200").trim();
const JWT_EXPIRES_IN = String(process.env.JWT_EXPIRES_IN || "7d").trim();

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is missing in .env (set it for production!)");
}


// -------------------------
// JWT auth middleware
// -------------------------
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = String(req.headers["authorization"] || "");
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// --------------------
// Helpers
// --------------------
function safeMsg(err, fallback = "Something went wrong") {
  return err?.message || fallback;
}

function requireAdminKey(req, res) {
  const key = String(req.body?.adminKey || "").trim();
  if (!key) {
    res.status(400).json({ message: "Admin key code is required." });
    return false;
  }
  if (key !== ADMIN_KEY_CODE) {
    res.status(403).json({ message: "Invalid admin key code." });
    return false;
  }
  return true;
}

// Simple JWT auth middleware (for admin change password)
function authenticate(req, res, next) {
  try {
    const auth = String(req.headers.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}

// --------------------
// POST /api/auth/login
// (Admin login; no key needed)
// --------------------
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // ✅ expects users table has role column OR defaults admin check later
    const [rows] = await db.query(
      "SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (!rows.length) return res.status(401).json({ message: "Invalid email or password." });

    const user = rows[0];

    // ✅ Only allow admins to login here
    const role = String(user.role || "").toLowerCase();
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // ✅ bcrypt compare (works only if password stored hashed)
    const ok = await bcrypt.compare(String(password), String(user.password || ""));
    if (!ok) return res.status(401).json({ message: "Invalid email or password." });

    const tokenPayload = { userId: user.id, email: user.email, role: "admin" };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      message: "Login successful.",
      user: { id: user.id, email: user.email, role: "admin" },
      token,
    });
  } catch (err) {
    return next(err);
  }
});

// --------------------
// POST /api/auth/admin/register
// (Admin register; requires key code)
// body: { adminKey, email, password }
// --------------------
router.post("/register", async (req, res, next) => {
  try {
    if (!requireAdminKey(req, res)) return;

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const [exists] = await db.query("SELECT id FROM users WHERE email=? LIMIT 1", [cleanEmail]);
    if (exists.length) {
      return res.status(409).json({ message: "Admin account with this email already exists." });
    }

    const hashed = await bcrypt.hash(String(password), 12);

    // ✅ Insert admin user
    await db.query("INSERT INTO users (email, password, role) VALUES (?, ?, 'admin')", [
      cleanEmail,
      hashed,
    ]);

    return res.json({ message: "Admin registered successfully." });
  } catch (err) {
    return next(err);
  }
});

// --------------------
// POST /api/auth/admin/change-password
// (Admin change; requires token + key code)
// body: { adminKey, currentPassword, newPassword }
// --------------------
router.post("/change-password", authenticate, async (req, res, next) => {
  try {
    if (!requireAdminKey(req, res)) return;

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required." });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    // ✅ must be admin
    if (String(req.user?.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }

    const userId = Number(req.user.userId);

    const [rows] = await db.query("SELECT id, password, role FROM users WHERE id=? LIMIT 1", [
      userId,
    ]);
    if (!rows.length) return res.status(404).json({ message: "Admin not found." });

    const admin = rows[0];
    if (String(admin.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }

    const ok = await bcrypt.compare(String(currentPassword), String(admin.password || ""));
    if (!ok) return res.status(401).json({ message: "Current password is incorrect." });

    const hashed = await bcrypt.hash(String(newPassword), 12);
    await db.query("UPDATE users SET password=? WHERE id=?", [hashed, userId]);

    return res.json({ message: "Password changed successfully." });
  } catch (err) {
    return next(err);
  }
});

// --------------------
// POST /api/auth/admin/reset-password
// (Admin reset; requires key code)
// body: { adminKey, email, newPassword }
// --------------------
router.post("/reset-password", async (req, res, next) => {
  try {
    if (!requireAdminKey(req, res)) return;

    const { email, newPassword } = req.body || {};
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const [rows] = await db.query(
      "SELECT id, role FROM users WHERE email=? LIMIT 1",
      [cleanEmail]
    );
    if (!rows.length) return res.status(404).json({ message: "Admin not found." });

    const admin = rows[0];
    if (String(admin.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }

    const hashed = await bcrypt.hash(String(newPassword), 12);
    await db.query("UPDATE users SET password=? WHERE id=?", [hashed, admin.id]);

    return res.json({ message: "Password reset successfully." });
  } catch (err) {
    return next(err);
  }
});

// ✅ GET /api/auth/me  (returns current logged-in user profile)
router.get("/me", authenticateToken, async (req, res, next) => {
  try {
    const userId = Number(req.user.userId);

    const [rows] = await db.query(
      `SELECT id, email, role, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "Profile fetched successfully.",
      user: rows[0],
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
