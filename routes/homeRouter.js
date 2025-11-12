const { Router } = require("express");
const db = require("../db/queries");
const { query, validationResult } = require("express-validator");

const homeRouter = Router();

homeRouter.get(
  "/",
  query("genre").optional().isInt().escape(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty() && req.query) {
      return res.redirect("/");
    }

    const targetGenre = req.query.genre;

    const items =
      targetGenre == null
        ? await db.getAllItems()
        : await db.getItemsForCategory(targetGenre);

    let categories = await db.getAllCategories();
    categories = categories.map((category) => ({
      ...category,
      link: "/?genre=" + category.id,
      editLink: "/genre/" + category.id,
    }));

    categories.unshift({
      name: "Uncategorized",
      link: "/?genre=-1",
      editLink: "",
    });
    categories.unshift({ name: "All", link: "/", editLink: "" });

    const selectedCategory =
      targetGenre === "-1"
        ? "Uncategorized"
        : categories.find((category) => category.id == targetGenre).name;

    const authors = await db.getAuthorsForIds(
      items.map((item) => item.author_id)
    );

    res.render("home", {
      items: items.map((item) => {
        const authorResult = authors.find(
          (author) => author.id === item.author_id
        );
        return {
          ...item,
          author: authorResult ? authorResult.name : null,
          link: "/book/" + item.id,
        };
      }),
      categories: categories,
      addNewUrl: "/genre/new",
      selectedCategory: selectedCategory,
      addBookUrl: "/book/new",
    });
  }
);

module.exports = homeRouter;
