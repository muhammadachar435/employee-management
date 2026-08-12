require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employees", require("./routes/employees"));

// Health
app.get("/api/health", (req, res) => {
  const now = new Date();
  res.json({
    status: "ok",
    timestamp: {
      iso: now.toISOString(),
      readable: now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "medium" }),
    },
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// PORT
app.listen(port, () => {
  console.log(`🚀 Backend Server running on http://localhost:${port}`);
});
