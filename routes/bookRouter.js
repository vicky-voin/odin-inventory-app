const { Router } = require("express");

const bookRouter = Router();

bookRouter.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  res.send(`Book with id ${bookId}`);
  //TODO: get book info from DB and render an editable form for a book
});

module.exports = bookRouter;
