require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const homeRouter = require("./routes/homeRouter");
const bookRouter = require("./routes/bookRouter");
const genreRouter = require("./routes/genreRouter");

const assetPath = path.join(__dirname, "public");

app.use(express.static(assetPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/book", bookRouter);
app.use("/genre", genreRouter);
app.use("/", homeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening on port ${PORT}`);
});
