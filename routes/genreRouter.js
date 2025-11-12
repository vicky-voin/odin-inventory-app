const { Router } = require("express");
const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const genreRouter = Router();

const validateGenre = [
  body("id").isInt(),
  body("name")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Genre name must be between 1 and 255 characters long")
    .custom(async (value) => {
      const searchResult = await db.getCategoryWithName(value);

      if (searchResult.length > 0) {
        throw Error("Genre with the same name already exists");
      }
      return true;
    }),
];

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

genreRouter.post("/new", validateGenre, async (req, res) => {
  const formData = matchedData(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("genreForm", {
      postUrl: req.baseUrl + req.url,
      deleteUrl: "",
      submitButtonText: "Add",
      genreData: formData,
      errors: errors.array(),
    });
  }

  await db.addCategory(formData);

  res.redirect("/");
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
