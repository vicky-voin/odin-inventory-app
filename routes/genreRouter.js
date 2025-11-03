const { Router } = require("express");

const genreRouter = Router();

genreRouter.get("/:genreId", async (req, res) => {
  const { genreId } = req.params;
  res.send(`Genre with id ${genreId}`);
  //TODO: get genre info from DB and render an editable form for a genre
});

module.exports = genreRouter;
