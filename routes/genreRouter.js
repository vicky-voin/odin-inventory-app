const { Router } = require("express");
const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const genreRouter = Router();

genreRouter.get("/new", async (req, res) => {
  res.render(`genreForm`, {
    postUrl: req.baseUrl + req.url,
    deleteUrl: "",
    submitButtonText: "Add",
    genreData: {
      id: -1,
      name: "",
    },
  });
});

genreRouter.get("/:genreId", async (req, res) => {
  const { genreId } = req.params;

  const genreData = (await db.getCategoryWithId(genreId))[0];

  res.render(`genreForm`, {
    postUrl: req.baseUrl + req.url,
    deleteUrl: `${req.baseUrl}/delete${req.url}`,
    genreData: {
      id: genreId,
      name: genreData.name,
    },
  });
});

module.exports = genreRouter;
