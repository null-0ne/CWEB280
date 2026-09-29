const { Sequelize } = require("sequelize");

// Create a single Sequelize instance that the entire app can share.
// This connects to a local SQLite file and keeps the database configuration in one place.
module.exports = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // The SQLite database file that stores the app data
});
