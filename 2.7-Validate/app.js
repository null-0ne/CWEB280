const express = require("express");
const exphbs = require("express-handlebars");

const { body, validationResult } = require("express-validator");

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
// app.engine("hbs", hbs.engine);
// app.set("view engine", "hbs");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Route: Show form
app.get("/", (req, res) => {
  res.render("form", {
    // First time we visit the page, there are no errors or previous data
    // Empty array & object
    errors: [],
    oldInput: {},
  });
});

// Route: Handle form submission with validation
app.post(
  "/register",
  [
    // Middleware - express validator uses to create the "rules"
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("age")
      .isInt({ min: 18 })
      .withMessage("You must be at least 18 years old"),
    // Mix and match validators for the query, cookies, headers, params, and above body
  ],
  (req, res) => {
    // ACTUALLY compare the user submitted data against the "rules"
    const errors = validationResult(req);

    // ENFORCE the rules - otherwise why the heck did you make the rules?
    if (!errors.isEmpty()) {
      // Re-render form with errors and old input
      return res.render("form", {
        errors: errors.array(), // Send back an array of error objects
        oldInput: req.body, // Send back the data that the user submitted
      });
    }

    // If valid → show success page
    res.render("success", { data: req.body });
  },
);

app.listen(port, () => console.log("Server running on http://localhost:3000"));
