const usersController = require("../controllers/userController");
const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();

router.post("/signup", usersController.createUser);
router.post("/login", usersController.login);
router.get("/verify",isAuthenticated, usersController.verify);
export default router;