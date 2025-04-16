const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

// * login
router.post("/login", userController.login);
// * register
router.post("/register", userController.register);

module.exports = router;