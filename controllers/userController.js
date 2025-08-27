const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");   // ✅ Add this line

const { generateToken } = require('../utils/jwt');
const db = require("../config/db"); // ✅ IMPORT DB here


// Register user
// controllers/userController.js
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, password required' });

    // ✅ check if user already exists
    const [existing] = await pool.execute("SELECT * FROM users WHERE email=?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashed, role || 'user']
    );

    const user = { id: result.insertId, name, email, role: role || 'user' };
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, name, email, role FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
