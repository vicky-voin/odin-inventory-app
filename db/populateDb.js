require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.argv.includes("DEV") ? "localhost" : process.argv[1],
  database: "odin_inventory",
  password: process.env.DB_PW,
  port: 5432,
});

client.connect();

client.query("BEGIN", (err) => {
  if (err) throw err;

  client.query(
    `CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name TEXT NOT NULL
    )`,
    (err) => {
      if (err) throw err;

      client.query(
        `CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name TEXT NOT NULL
        )`,
        (err) => {
          if (err) throw err;

          client.query(
            `CREATE TABLE IF NOT EXISTS books (
              id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
              title TEXT NOT NULL,
              genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
              author_id INTEGER REFERENCES authors(id)
            )`,
            (err) => {
              if (err) throw err;

              const genres = [
                "Non-Fiction",
                "Science Fiction",
                "Fantasy",
                "Mystery",
              ];
              const insertGenre = "INSERT INTO genres (name) VALUES ($1)";
              genres.forEach((genre) => {
                client.query(insertGenre, [genre], (err) => {
                  if (err) throw err;
                });
              });

              const authors = [
                "George Orwell",
                "Isaac Asimov",
                "Agatha Christie",
                "Brandon Sanderson",
                "Brené Brown",
              ];
              const insertAuthor = "INSERT INTO authors (name) VALUES ($1)";
              authors.forEach((author) => {
                client.query(insertAuthor, [author], (err) => {
                  if (err) throw err;
                });
              });

              const insertBook =
                "INSERT INTO books (title, genre_id, author_id) VALUES ($1, $2, $3)";
              const books = [
                ["1984", 2, 1],
                ["Animal Farm", 2, 1],
                ["Foundation", 2, 2],
                ["Mistborn", 3, 4],
                ["The Way of Kings", 3, 4],
                ["Dare to Lead", 1, 5],
                ["The Gifts of Imperfection", 1, 5],
                ["I, Robot", 2, 2],
                ["Murder on the Orient Express", 4, 3],
              ];

              books.forEach(([title, genreId, authorId]) => {
                client.query(insertBook, [title, genreId, authorId], (err) => {
                  if (err) throw err;
                });
              });

              client.query("COMMIT", (err) => {
                if (err) throw err;
                client.end();
              });
            }
          );
        }
      );
    }
  );
});
