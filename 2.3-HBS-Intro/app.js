const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PORT = 8080;

//boilerplate code to connect render engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views"); //tells hbs to look in the views folder

//handle when user visits http://localhost:8080/
app.get("/", (req, res) => {
  res.render("home", {
    title: "Student List",
    students: ["Bob", "Georgie", "Tim"],
    isLoggedIn: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
