const pool = require("./pool");

async function testQuery() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

module.exports = {
  testQuery,
};
