const { Router } = require("express");
const db = require("../db/queries");

const homeRouter = Router();

homeRouter.get("/", async (req, res) => {
  const query = req.query;
  const targetGenre = query["genre"];

  const items =
    targetGenre == null
      ? await db.getAllItems()
      : await db.getItemsForCategory(targetGenre);

  let categories = await db.getAllCategories();
  categories = categories.map((category) => ({
    ...category,
    link: "/?genre=" + category.id,
  }));

  categories.unshift({ name: "All", link: "/" });

  const selectedCategory = categories.find(
    (category) => category.id == targetGenre
  ).name;

  const authors = await db.getAuthorsForIds(
    items.map((item) => item.author_id)
  );

  res.render("home", {
    items: items.map((item) => ({
      ...item,
      author: authors.find((author) => author.id === item.author_id).name,
      link: "/book/" + item.id,
    })),
    categories: categories,
    selectedCategory: selectedCategory,
  });
});

module.exports = homeRouter;
