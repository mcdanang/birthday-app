const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// Get user data
router.get("/", UserController.getUser);

// Create a user
router.post("/", UserController.createUser);

// Delete a user
router.delete("/:userId", UserController.deleteUser);

// Edit user details
router.put("/:userId", UserController.updateUser);

module.exports = router;
