const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON and parse HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample data (in-memory, in a real application this would be stored in database)
const users = [
  { id: Date.now(), name: "Alice" },
  { id: Date.now() + 1, name: "Bob" },
];

// This route handles a GET request to the /users path.
// It retrieves all user data and sends it back as a JSON response.
app.get("/users", (req, res) => {
  // res.json() sends a JSON response to the client.
  res.json(users);
});

// This route handles a POST request to the /users path.
// It takes data from the request body and creates a new user.
app.post("/users", (req, res) => {
  // The data sent by the client is in req.body.
  const newUser = req.body;
  console.log("Received new user:", newUser);

  // In a real app, you would save this `newUser` object to the database.
  // The databse would assign the id for now let's pretend we're assigning it a new ID.
  newUser.id = Date.now();
  users.push(newUser); //pretend to save new user to database

  // Send a response back to the client, confirming the creation.
  // A 201 status code is a standard for successful creation.
  res
    .status(201)
    .json({ message: "User created successfully!", user: newUser });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/users`);
});
