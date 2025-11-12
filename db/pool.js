require("dotenv").config();
const { Pool } = require("pg");

//TODO: ideally, introduce a variable for deployment environment
//instead of checking whether user & pw vars are defined
const poolConfig =
  process.env.DB_USER && process.env.DB_PW
    ? {
        host: "localhost",
        user: process.env.DB_USER,
        database: "odin_inventory",
        password: process.env.DB_PW,
        port: 5432,
      }
    : {
        connectionString: process.env.DB_URL,
      };

module.exports = new Pool(poolConfig);
