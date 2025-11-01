require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const db = require("./db/queries");

const assetPath = path.join(__dirname, "public");

app.use(express.static(assetPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const items = await db.testQuery();
  res.render("home", { items: items.map((item) => item.name) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening on port ${PORT}`);
});
