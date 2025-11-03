const pool = require("./pool");

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

async function getItemsForCategory(category) {
  const { rows } = await pool.query(
    `SELECT * FROM items WHERE genreid = '${category}'`
  );
  return rows;
}

module.exports = {
  getAllItems,
  getItemsForCategory,
};
