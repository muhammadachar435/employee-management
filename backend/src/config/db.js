const { Pool, Client } = require("pg");
const { connectionString, idleTimeoutMillis } = require("pg/lib/defaults");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Database Connection Error", err.stack);
  } else {
    console.log("Connected to Postgresql Database");
    release();
  }
});

module.exports = pool;
