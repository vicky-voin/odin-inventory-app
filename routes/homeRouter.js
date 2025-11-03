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
  res.render("home", { items: items.map((item) => item.name) });
});

module.exports = homeRouter;
