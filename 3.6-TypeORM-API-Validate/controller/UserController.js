/**
 * This is a bad example of a controller.
 * It's too dependant to the express framework, request and response.
 * The functions should accept only the parameters needed to complete
 * the task (not req or res)
 * Also: Functions should return the object or a null if it fails.
 *      Not call res.json
 */

const { AppDataSource } = require("../data-source");
const { User } = require("../entity/User");
const { UserSchema } = require("../schema/UserSchema");

module.exports.UserController = new (class {
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // framework agnostic
  async saveAll(users) {
    // array of users
    if (!Array.isArray(users)) {
      return null; // signals that it failed
    }
    try {
      const results = [];
      const errors = [];
      // validate the items in the users array and save error as needed
      // return the results and errors
      // app.js - call this function in separate .then

      //  STEP TWO: Check for violations - Validate request body
      users.forEach(async (user) => {
        const { error, value } = UserSchema.validate(user);

        // STEP THREE: Enforce the rules!
        if (error) {
          errors.push(error);
        } else {
          const result = await this.userRepository.save(user);
          results.push(result);
        }
      });

      return { results, errors };
    } catch (err) {
      return null;
    }
  }

  // GET /users
  async all(req, res) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /users/:id
  async one(req, res) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /users
  async create(req, res) {
    try {
      //  STEP TWO: Check for violations - Validate request body
      const { error, value } = UserSchema.validate(req.body);

      // STEP THREE: Enforce the rules!
      if (error) {
        return res
          .status(400)
          .json({ error: error.details.map((d) => d.message) });
      }

      // STEP FOUR: Save to DB if valid!
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // PUT /users/:id
  async update(req, res) {
    try {
      //  STEP TWO: Check for violations - Validate request body
      const { error, value } = UserSchema.validate(req.body);

      // STEP THREE: Enforce the rules!
      if (error) {
        return res
          .status(400)
          .json({ error: error.details.map((d) => d.message) });
      }

      // STEP FOUR: Save to DB if valid!
      await this.userRepository.update(req.params.id, value);
      const updatedUser = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // DELETE /users/:id
  async remove(req, res) {
    try {
      await this.userRepository.delete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
})();
