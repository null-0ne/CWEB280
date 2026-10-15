/**
 * Route files let us split off the routes from app.js into several
 * other files.
 */

const express = require("express");
const router = express.Router();
const { UserController } = require("./controller/UserController");

/**
 * In the app.js file, we have app.use('/users', userRoutes);
 * This means that the full path to the routes below is
 * http://localhost:5000/users
 */

router.get("/", UserController.all.bind(UserController)); // bind re-establishes "this" to the UserController class
router.get("/:id", UserController.one.bind(UserController));
router.post("/", UserController.create.bind(UserController));
router.put("/:id", UserController.update.bind(UserController));
router.delete("/:id", UserController.remove.bind(UserController));

module.exports = router;
