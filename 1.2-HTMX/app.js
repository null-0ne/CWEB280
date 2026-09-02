const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/hello", (req, res) => {
  res.send("<p>Hello from server! </p>");
});

app.post("/save-data", (req, res) => {
  const { name } = req.body;
  res.send(`<p>Nice to meet you, <strong>${name}</strong>!</p>`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
