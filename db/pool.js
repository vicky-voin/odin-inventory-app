const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost",
  user: process.env.DB_USER,
  database: "odin_inventory",
  password: process.env.DB_PW,
  port: 5432,
});
