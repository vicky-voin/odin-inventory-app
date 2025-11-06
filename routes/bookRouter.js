const { Router } = require("express");
const db = require("../db/queries");

const bookRouter = Router();

bookRouter.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  const book = await db.getItemWithId(bookId);

  const author = await db.getAuthorsForIds([book.author_id]);

  book.author = author[0].name;

  const allGenres = await db.getAllCategories();

  book.genre = allGenres.find((genre) => genre.id === book.genre_id).name;

  res.render("bookForm", {
    formUrl: req.baseUrl + req.url,
    bookData: book,
    genres: allGenres,
  });
});

bookRouter.post("/:bookId", async (req, res) => {
  res.send("Book updated!");
});

module.exports = bookRouter;
