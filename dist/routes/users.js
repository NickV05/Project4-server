import * as usersController from "../controllers/userController.js";
import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();
router.post("/signup", usersController.createUser);
router.post("/login", usersController.login);
router.get("/verify", isAuthenticated, usersController.verify);
export default router;
