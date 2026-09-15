const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PORT = 8080;
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: "./views/layouts",
  partialsDir: "./views/partials",
  helpers: {
    isEqual: (a, b, options) => {
      return a === b ? options.fn(this) : options.inverse(this);
    },
    multiply: (a, b) => a * b,
    formatPrice: (price) => `$${price.toFixed(2)}`,
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/status", (req, res) => {
  res.render("status", {
    title: "User Status",
    userRole: "admin",
  });
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    title: "Shopping Cart",
    items: [
      { name: "Book", price: 10, quantity: 2 },
      { name: "Pen", price: 2, quantity: 5 },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
