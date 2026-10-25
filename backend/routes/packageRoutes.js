// routes/packageRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db"); // promise-based MySQL pool

const router = express.Router();

// ✅ ENV secret (no hardcoding)
const JWT_SECRET = String(process.env.JWT_SECRET || "").trim();
if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET missing in .env (packageRoutes auth will fail in production)");
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

// -------------------------
// Helpers
// -------------------------
const generateTrackerNumber = () => {
  const prefix = "AAE1-12-";
  const randomNumber = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, "0");
  return `${prefix}${randomNumber}`;
};

const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ─── PROTECTED ROUTE: Create a new package ───
router.post("/create-package", authenticateToken, async (req, res) => {
  try {
    const {
      sender_name,
      sender_address,
      recipient_name,
      recipient_address,
      location,
      delivery_charge,
      delivery_date,
      shipped_out_date,
      status,
      package_information,
    } = req.body || {};

    // Validate required fields
    if (!sender_name) return res.status(400).json({ message: "sender_name is required." });
    if (!sender_address) return res.status(400).json({ message: "sender_address is required." });
    if (!recipient_name) return res.status(400).json({ message: "recipient_name is required." });
    if (!recipient_address)
      return res.status(400).json({ message: "recipient_address is required." });

    const tracker_number = generateTrackerNumber();

    const packageDeliveryDate = delivery_date || getCurrentDate();
    const packageLocation = location || "Unknown";
    const deliveryChargeVal = delivery_charge || "not_paid";
    const packageStatus = status || "hold";
    const finalPackageInfo = package_information || "";
    const shippedOutDateVal = shipped_out_date || null;

    const insertQuery = `
      INSERT INTO packages
        (tracker_number,
         sender_name,
         sender_address,
         recipient_name,
         recipient_address,
         location,
         delivery_charge,
         delivery_date,
         shipped_out_date,
         status,
         package_information)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      tracker_number,
      sender_name,
      sender_address,
      recipient_name,
      recipient_address,
      packageLocation,
      deliveryChargeVal,
      packageDeliveryDate,
      shippedOutDateVal,
      packageStatus,
      finalPackageInfo,
    ]);

    return res.status(201).json({
      message: "Package created successfully!",
      package: {
        id: result.insertId,
        tracker_number,
        sender_name,
        sender_address,
        recipient_name,
        recipient_address,
        location: packageLocation,
        delivery_charge: deliveryChargeVal,
        delivery_date: packageDeliveryDate,
        shipped_out_date: shippedOutDateVal,
        status: packageStatus,
        package_information: finalPackageInfo,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error while creating package.",
      details: err.message,
    });
  }
});
// ─── PROTECTED ROUTE: Update a package by tracker number ───
router.put("/package/:tracker_number", authenticateToken, async (req, res) => {
  const { tracker_number } = req.params;

  const {
    sender_name,
    sender_address,
    recipient_name,
    recipient_address,
    location,
    delivery_charge,
    delivery_date,
    shipped_out_date,
    status,
    package_information,
  } = req.body || {};

  try {
    const [existing] = await db.query("SELECT * FROM packages WHERE tracker_number = ?", [
      tracker_number,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Package not found." });
    }

    const pkg = existing[0];

    const updateQuery = `
      UPDATE packages SET
        sender_name = ?,
        sender_address = ?,
        recipient_name = ?,
        recipient_address = ?,
        location = ?,
        delivery_charge = ?,
        delivery_date = ?,
        shipped_out_date = ?,
        status = ?,
        package_information = ?
      WHERE tracker_number = ?
    `;

    await db.query(updateQuery, [
      sender_name ?? pkg.sender_name,
      sender_address ?? pkg.sender_address,
      recipient_name ?? pkg.recipient_name,
      recipient_address ?? pkg.recipient_address,
      location ?? pkg.location,
      delivery_charge ?? pkg.delivery_charge,
      delivery_date ?? pkg.delivery_date,
      shipped_out_date ?? pkg.shipped_out_date,
      status ?? pkg.status,
      package_information ?? pkg.package_information,
      tracker_number,
    ]);

    return res.status(200).json({ message: "Package updated successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error while updating package.",
      details: err.message,
    });
  }
});
// ─── PROTECTED ROUTE: Get all tracker numbers with their ids ───
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, tracker_number FROM packages ORDER BY id DESC");

    if (results.length === 0) {
      return res.status(404).json({ message: "No packages found" });
    }

    const trackerNumbers = results.map((pkg) => ({
      id: pkg.id,
      tracker_number: pkg.tracker_number,
    }));

    return res.status(200).json(trackerNumbers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});
// ─── PROTECTED ROUTE: Get a package by ID ───
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("SELECT * FROM packages WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Package not found." });
    }

    return res.status(200).json({ package: results[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});
// ─── PROTECTED ROUTE: Delete a package by tracker number ───
router.delete("/package/:tracker_number", authenticateToken, async (req, res) => {
  const { tracker_number } = req.params;

  try {
    const [existing] = await db.query("SELECT id FROM packages WHERE tracker_number = ?", [
      tracker_number,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Package not found." });
    }

    await db.query("DELETE FROM packages WHERE tracker_number = ?", [tracker_number]);

    return res.status(200).json({ message: "Package deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error while deleting package.",
      details: err.message,
    });
  }
});

// ─── PUBLIC: Get all tracker numbers with their ids (no auth) ───
router.get("/no/hidden", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, tracker_number FROM packages ORDER BY id DESC");

    if (results.length === 0) {
      return res.status(404).json({ message: "No packages found" });
    }

    const trackerNumbers = results.map((pkg) => ({
      id: pkg.id,
      tracker_number: pkg.tracker_number,
    }));

    return res.status(200).json(trackerNumbers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});



// ─── PUBLIC: Get a package by tracker number ───
router.get("/package/:tracker_number", async (req, res) => {
  const { tracker_number } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM packages WHERE tracker_number = ?", [
      tracker_number,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Package not found." });
    }

    return res.status(200).json({ package: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error while retrieving package.",
      details: err.message,
    });
  }
});
// ─── PUBLIC: Get all updates for a package by tracker number ───
router.get("/package/:tracker_number/updates", async (req, res) => {
  const { tracker_number } = req.params;

  try {
    const [updates] = await db.query(
      `SELECT id, update_message, location, created_at
       FROM package_updates
       WHERE tracker_number = ?
       ORDER BY created_at ASC`,
      [tracker_number]
    );

    return res.json({ tracker_number, updates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch updates.",
      details: err.message,
    });
  }
});

// ─── PROTECTED ROUTE: Add update to a package ───
router.post("/package/:tracker_number/update", authenticateToken, async (req, res) => {
  const { tracker_number } = req.params;
  const { update_message, location } = req.body || {};

  try {
    if (!update_message) {
      return res.status(400).json({ message: "update_message is required." });
    }

    const [pkg] = await db.query(
      "SELECT tracker_number FROM packages WHERE tracker_number = ?",
      [tracker_number]
    );

    if (pkg.length === 0) {
      return res.status(404).json({ message: "Package not found." });
    }

    const insertQuery = `
      INSERT INTO package_updates
        (tracker_number, update_message, location)
      VALUES (?, ?, ?)
    `;

    await db.query(insertQuery, [tracker_number, update_message, location || null]);

    return res.status(201).json({ message: "Package update added successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error while adding update.",
      details: err.message,
    });
  }
});
// ─── PROTECTED ROUTE: Update an existing package update ───
router.put("/package/updates/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { update_message, location, created_at } = req.body || {};

  try {
    const [rows] = await db.query("SELECT * FROM package_updates WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Update not found." });
    }

    const existing = rows[0];

    await db.query(
      `UPDATE package_updates SET
        update_message = ?,
        location = ?,
        created_at = ?
       WHERE id = ?`,
      [
        update_message ?? existing.update_message,
        location ?? existing.location,
        created_at ?? existing.created_at,
        id,
      ]
    );

    return res.status(200).json({ message: "Update edited successfully (time included)." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error while editing update.",
      details: err.message,
    });
  }
});
// ─── PROTECTED ROUTE: Delete a package update ───
router.delete("/package/updates/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT id FROM package_updates WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Update not found." });
    }

    await db.query("DELETE FROM package_updates WHERE id = ?", [id]);

    return res.status(200).json({ message: "Update deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error while deleting update.",
      details: err.message,
    });
  }
});




module.exports = router;
