import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "review",
  password: "rahul",
  port: 5432,
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let sort = 'score';

app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, author, isbn, date, score, amazon, summary FROM book ORDER BY $1 DESC;",
      [sort]
    );
    let books = result.rows;
    console.log(books);
    res.render("index.ejs", { books: books });
  } catch (error) {
    console.log(error);
  }
});

app.get("/book", (req, res) => {
  sort = req.query.sort;
  res.redirect("/");
})

app.get("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(
      "SELECT id, title, author, isbn, date, score, amazon, summary, notes FROM book WHERE id = $1;",
      [id]
    );
    res.render("note.ejs", { book: result.rows[0] });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
