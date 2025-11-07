const { Router } = require("express");
const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const bookRouter = Router();

const validateBook = [
  body("id").isInt(),
  body("title")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Book title must be between 1 and 255 characters long"),
  body("author")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Book author must be between 1 and 255 characters long"),
  body("genre").trim(),
];

bookRouter.get("/new", async (req, res) => {
  const allGenres = await db.getAllCategories();

  res.render("bookForm", {
    postUrl: req.baseUrl + req.url,
    deleteUrl: "",
    submitButtonText: "Add",
    bookData: {
      id: -1,
      title: "",
      author: "",
    },
    genres: allGenres,
  });
});

bookRouter.post("/new", validateBook, async (req, res) => {
  const formData = matchedData(req);
  const allGenres = await db.getAllCategories();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("bookForm", {
      postUrl: req.baseUrl + req.url,
      deleteUrl: "",
      submitButtonText: "Add",
      bookData: formData,
      genres: allGenres,
      errors: errors.array(),
    });
  }

  formData.genre_id = allGenres.find(
    (genre) => genre.name === formData.genre
  ).id;

  const author = await db.getAuthorForName(formData.author);
  if (author[0]) {
    formData.author_id = author[0].id;
  } else {
    const createdAuthor = await db.createAuthor(formData.author);
    if (createdAuthor) {
      formData.author_id = createdAuthor.id;
    } else {
      return res.status(500).render("bookForm", {
        postUrl: req.baseUrl + req.url,
        deleteUrl: "",
        submitButtonText: "Add",
        bookData: formData,
        genres: allGenres,
        errors: ["Server error: could not register new author"],
      });
    }
  }

  await db.addItem(formData);

  res.redirect("/");
});

bookRouter.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  const book = await db.getItemWithId(bookId);

  const author = await db.getAuthorsForIds([book.author_id]);

  book.author = author[0] ? author[0].name : null;

  const allGenres = await db.getAllCategories();

  book.genre = allGenres.find((genre) => genre.id === book.genre_id).name;

  res.render("bookForm", {
    postUrl: req.baseUrl + req.url,
    deleteUrl: `${req.baseUrl}/delete${req.url}`,
    bookData: book,
    genres: allGenres,
  });
});

bookRouter.post(
  "/delete/:bookId",
  [body("id").isInt().isLength({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("errorPage");
    }

    const formData = matchedData(req);

    await db.deleteItemWithId(formData.id);

    res.redirect("/");
  }
);

bookRouter.post("/:bookId", [
  validateBook,
  async (req, res) => {
    const formData = matchedData(req);
    const allGenres = await db.getAllCategories();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("bookForm", {
        formUrl: req.baseUrl + req.url,
        bookData: formData,
        genres: allGenres,
        errors: errors.array(),
      });
    }

    formData.genre_id = allGenres.find(
      (genre) => genre.name === formData.genre
    ).id;

    const author = await db.getAuthorForName(formData.author);
    if (author[0]) {
      formData.author_id = author[0].id;
    } else {
      const createdAuthor = await db.createAuthor(formData.author);
      if (createdAuthor) {
        formData.author_id = createdAuthor.id;
      } else {
        return res.status(500).render("bookForm", {
          formUrl: req.baseUrl + req.url,
          bookData: formData,
          genres: allGenres,
          errors: ["Server error: could not register new author"],
        });
      }
    }

    await db.updateItem(formData);

    res.redirect("/");
  },
]);

module.exports = bookRouter;
