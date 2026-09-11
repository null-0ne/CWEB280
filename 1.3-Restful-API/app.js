const express = require("express");
const { randomUUID } = require("crypto");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Fake "database" (in-memory array)
let users = [
  { id: randomUUID(), name: "Alice Johnson", email: "alice@example.com" },
  { id: randomUUID(), name: "Bob Smith", email: "bob@example.com" },
];
let nextUserId = randomUUID();

// 1. GET /api/users - Retrieve all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// 2. GET /api/users/:id - Retrieve a user by ID
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).send("User not found.");
  }
  res.json(user);
});

// 3. POST /api/users - Create a new user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send("Name and email are required.");
  }

  const newUser = { id: randomUUID(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 4. PUT /api/users/:id - Update an existing user
app.put("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  res.json(user);
});

// 5. DELETE /api/users/:id - Delete a user
app.delete("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  users = users.filter((u) => u.id !== user.id);
  res.status(204).send(); // 204 = No Content
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api/users`);
});
