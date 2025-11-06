const pool = require("./pool");

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM books");
  return rows;
}

async function getItemWithId(id) {
  const { rows } = await pool.query(`SELECT * FROM books WHERE id = $1`, [id]);
  return rows[0];
}

async function updateItem(data) {
  const result = await pool.query(
    `UPDATE books SET title = $1, author_id = $2, genre_id = $3 WHERE id = $4;`,
    [data.title, data.author_id, data.genre_id, data.id]
  );

  console.log(`Updated item with id: ${data.id}`);

  return result;
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

async function getAuthorForName(name) {
  const { rows } = await pool.query(`SELECT * FROM authors WHERE name = $1`, [
    name,
  ]);
  return rows;
}

async function createAuthor(authorName) {
  const result = await pool.query(
    "INSERT INTO authors (name) VALUES ($1) RETURNING *",
    [authorName]
  );

  console.log(`Added new author: ${authorName}`);

  return result.rows[0];
}

module.exports = {
  getAllItems,
  getItemWithId,
  getItemsForCategory,
  updateItem,
  getAllCategories,
  getAuthorsForIds,
  getAuthorForName,
  createAuthor,
};
