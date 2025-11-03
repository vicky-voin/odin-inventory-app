const pool = require("./pool");

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

async function getItemsForCategory(category) {
  const { rows } = await pool.query(
    `SELECT * FROM items WHERE genreId = ${category}`
  );
  return rows;
}

module.exports = {
  getAllItems,
  getItemsForCategory,
  getAllCategories,
};
