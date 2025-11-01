require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db/queries");

app.get("/", async (req, res) => {
  const items = await db.testQuery();
  res.send("Items: " + items.map((item) => item.name).join(", "));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening on port ${PORT}`);
});
