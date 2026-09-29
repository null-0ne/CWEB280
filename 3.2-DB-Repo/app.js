const express = require("express");
const sequelize = require("./database");
const userRepository = require("./user-repository");
const seedUsers = require("./user-seed");

const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON request bodies.
app.use(express.json());

// Get all users.
// This route returns every record in the User table.
app.get("/users", async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// Get one user by email.
// The route parameter is treated as the email value and looked up in the database.
app.get("/users/:email", async (req, res) => {
  try {
    const user = await userRepository.findByEmail(req.params.email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// Create a new user.
// The request body should contain username, email, and password.
app.post("/users", async (req, res) => {
  try {
    const newUser = await userRepository.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update an existing user by ID.
// The request body contains the fields to update.
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await userRepository.updateUser(
      req.params.id,
      req.body,
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user by ID.
app.delete("/users/:id", async (req, res) => {
  try {
    const success = await userRepository.deleteUser(req.params.id);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Application startup sequence:
// 1. Verify the database connection
// 2. Sync the model with the database schema
// 3. Add seeded users to the database
// 4. Start listening for incoming HTTP requests
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sync the model to the SQLite database.
    // force: true drops and recreates the table, which is useful for demo work.
    await sequelize.sync({ force: false });
    console.log("Database synced");

    // Populate the database with sample users so the app has data immediately.
    await seedUsers();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/users`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
})();
