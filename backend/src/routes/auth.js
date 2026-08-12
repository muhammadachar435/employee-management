const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
// const { use } = require("react");

const router = express.Router();

// Register

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email & Password must be required" });
    }

    const existingUser = await pool.query('SELECT id FROM "User" WHERE email=$1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User Already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Generated hash psd", email);

    const result = await pool.query(
      'INSERT INTO "User" (email,password,role) VALUES($1,$2,$3) RETURNING id,email,role',
      [email, hashedPassword, role || "employee"],
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    console.log("User Registered", user.email);

    res.status(201).json({
      message: "user registered Successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email & Password are required" });
    }

    const result = await pool.query('SELECT id ,email,password , role FROM "User" WHERE email=$1', [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
