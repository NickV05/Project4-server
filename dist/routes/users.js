"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import * as usersController from "../controllers/userController";
import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
const router = express.Router();
router.post("/signup", usersController.createUser);
router.post("/login", usersController.login);
router.get("/verify", isAuthenticated, usersController.verify);
exports.default = router;
