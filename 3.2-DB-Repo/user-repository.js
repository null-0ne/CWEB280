const User = require("./user-model");
// USUALLY BUSINESS LOGIC GOES HERE
// DO NOT PASS IN REQUEST OR RESPONSE OBJECTS!!

// This repository acts as a layer between the Express routes and the database.
// It keeps the route code cleaner and centralizes all database access logic.
module.exports = new (class UserRepository {
  // Return all users from the database.
  async findAllUsers() {
    return await User.findAll();
  }

  // Find a single user by their email address.
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  // Create a new user record using the provided data.
  async createUser(userData) {
    return await User.create(userData);
  }

  // Update an existing user by ID.
  // If no matching user is found, return null.
  async updateUser(userId, newUserData) {
    const user = await User.findByPk(userId);
    if (user) return await user.update(newUserData);
    return null;
  }

  // Delete a user by ID.
  // Return true if the user was removed, otherwise false.
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      return true;
    }
    return false;
  }
})();
