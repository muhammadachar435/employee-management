const express = require("express");
const pool = require("../config/db");
const { adminMiddleware, authMiddleware } = require("../middleware/auth");

const router = express.Router();
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Employee" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch Employee" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM "Employee" WHERE id=$1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employer not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Failed to fetch employee" });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, phone, department, salary, status } = req.body;
    const existing = await pool.query('SELECT id FROM "Employee" WHERE email=$1', [email]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email Already exists" });
    }

    const result = await pool.query(
      'INSERT INTO "Employee" (name,email,phone,department,salary,status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, email, phone, department, parseFloat(salary), status || "active"],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to Create Employee" });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, department, phone, salary, status } = req.body;

    const exists = await pool.query('SELECT id FROM "Employee" WHERE id=$1 ', [id]);

    if (exists.rows.length === 0) {
      return res.status(400).json({ error: "Employee Not Found" });
    }

    const emailCheck = await pool.query('SELECT id FROM "Employee" WHERE email=$1 AND id!=$2', [
      email,
      id,
    ]);

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const result = await pool.query(
      'UPDATE "Employee" SET name=$1,email=$2,phone=$3,department=$4,salary=$5,status=$6, "updatedAt"= CURRENT_TIMESTAMP WHERE id =$7 RETURNING *',
      [name, email, phone, department, parseFloat(salary), status, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Faield to Update Employee" });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query('DELETE FROM "Employee" WHERE id=$1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee Successfully Delete" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to Delete Employee" });
  }
});

router.get("/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM "Employee" ');
    const active = await pool.query('SELECT COUNT(*) FROM "Employee" WHERE status = $1', ["active"]);
    const inactive = await pool.query('SELECT COUNT(*) FROM "Employee" WHERE status = $1', ["inactive"]);

    res.json({
      total: parseInt(total.rows[0].count),
      activeEmployees: parseInt(active.rows[0].count),
      inactiveEmployees: parseInt(inactive.rows[0].count),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
