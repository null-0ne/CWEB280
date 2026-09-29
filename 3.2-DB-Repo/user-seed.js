const User = require("./user-model");

// Seed the database with a few starter users when the app starts.
// This helps students test CRUD operations without manually inserting records.
module.exports = async function seedUsers() {
  const users = [
    { username: "admin", email: "admin@t.ca", password: "12345Pwd" },
    { username: "john", email: "john@t.ca", password: "12345Pwd" },
    { username: "jane", email: "jane@t.ca", password: "12345Pwd" },
  ];

  for (const user of users) {
    // findOrCreate prevents duplicate records for the same email.
    const [, created] = await User.findOrCreate({
      where: { email: user.email },
      defaults: user,
    });

    console.log(`${created ? "Created" : "Skipped"} user: ${user.email}`);
  }
};
