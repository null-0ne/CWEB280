const express = require("express");
const { AppDataSource } = require("./data-source");
const { User } = require("./entity/User");
const userSeed = require("./fixtures/user-seed");
const { Repository } = require("typeorm");

const app = express();
const PORT = 5000;

app.use(express.json()); // for JSON requests
app.use(express.urlencoded({ extended: true })); // for form submissions

// Connect DB
AppDataSource.initialize()
  .then(() => {
    console.log("DB Connected ");
    // seed 3 user  - return the result of save([{},{},{}])
    const repo = AppDataSource.getRepository(User);
    return repo.save(userSeed);
  })
  .then((result) => {
    //consolelog result
    console.log(result);
  })
  .catch((err) => console.error(err));

// Create a new user
app.post("/users", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User); // 1. Get repo for the entity
  const user = userRepository.create(req.body); // 2. Create new instance of the entity from a JS object (req.body)
  const result = await userRepository.save(user); // 3. Wait for entity to persist in the database
  res.json(result); // 4. Return resulting entity as JSON
});

// Get all users
app.get("/users", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  res.json(users);
});

// Get user by id
app.get("/users/:id", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
  res.json(user);
});

// Update user by id
app.put("/users/:id", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.update(req.params.id, req.body);
  const updatedUser = await userRepository.findOneBy({
    id: parseInt(req.params.id),
  });
  res.json(updatedUser);
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.delete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/users`);
});
