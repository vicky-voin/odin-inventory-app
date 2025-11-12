const pool = require("./pool");

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM books");
  return rows;
}

async function getItemWithId(id) {
  const { rows } = await pool.query(`SELECT * FROM books WHERE id = $1`, [id]);
  return rows[0];
}

async function deleteItemWithId(id) {
  const { rows } = await pool.query(`DELETE FROM books WHERE id = $1`, [id]);

  console.log("Deleted item with id: " + id);

  return rows[0];
}

async function updateItem(data) {
  const result = await pool.query(
    `UPDATE books SET title = $1, author_id = $2, genre_id = $3 WHERE id = $4;`,
    [
      data.title,
      data.author_id,
      data.genre_id === -1 ? null : data.genre_id,
      data.id,
    ]
  );

  console.log(`Updated item with id: ${data.id}`);

  return result;
}

async function addItem(data) {
  const result = await pool.query(
    `INSERT INTO books (title, author_id, genre_id) VALUES ($1, $2, $3) RETURNING *;`,
    [data.title, data.author_id, data.genre_id]
  );

  console.log(`Added item with id: ${result.rows[0].id}`);

  return result;
}

async function getCategoryWithId(id) {
  const { rows } = await pool.query(`SELECT * FROM genres WHERE id = $1`, [id]);
  return rows;
}

async function getCategoryWithName(name) {
  const { rows } = await pool.query(`SELECT * FROM genres WHERE name = $1`, [
    name,
  ]);
  return rows;
}

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getItemsForCategory(category) {
  let query, params;
  if (category === "-1") {
    query = "SELECT * FROM books WHERE genre_id IS NULL";
    params = [];
  } else {
    query = "SELECT * FROM books WHERE genre_id = $1";
    params = [category];
  }

  const { rows } = await pool.query(query, params);
  return rows;
}

async function addCategory(data) {
  const result = await pool.query(
    `INSERT INTO genres (name) VALUES ($1) RETURNING *;`,
    [data.name]
  );

  console.log(`Added category with id: ${result.rows[0].id}`);

  return result;
}

async function updateCategory(data) {
  const result = await pool.query(
    `UPDATE genres SET name = $1 WHERE id = $2;`,
    [data.name, data.id]
  );

  console.log(`Updated category with id: ${data.id}`);

  return result;
}

async function deleteCategoryWithId(id) {
  await removeGenreReferences(id);

  const result = await pool.query(`DELETE FROM genres WHERE id = $1;`, [id]);

  console.log(`Deleted category with id: ${id}`);

  return result;
}

async function removeGenreReferences(genreId) {
  const query = "UPDATE books SET genre_id = NULL WHERE genre_id = $1";
  await pool.query(query, [genreId]);
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
  deleteItemWithId,
  getItemsForCategory,
  updateItem,
  addItem,
  getAllCategories,
  getCategoryWithId,
  getCategoryWithName,
  addCategory,
  updateCategory,
  deleteCategoryWithId,
  getAuthorsForIds,
  getAuthorForName,
  createAuthor,
};
