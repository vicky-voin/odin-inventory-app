const pool = require("./pool");

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM books");
  return rows;
}

async function getItemWithId(id) {
  const { rows } = await pool.query(`SELECT * FROM books WHERE id = $1`, [id]);
  return rows[0];
}

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getItemsForCategory(category) {
  const { rows } = await pool.query(`SELECT * FROM books WHERE genre_id = $1`, [
    category,
  ]);
  return rows;
}

async function getAuthorsForIds(ids) {
  const { rows } = await pool.query(
    `SELECT * FROM authors WHERE id = ANY($1::int[])`,
    [ids]
  );
  return rows;
}

module.exports = {
  getAllItems,
  getItemWithId,
  getItemsForCategory,
  getAllCategories,
  getAuthorsForIds,
};
