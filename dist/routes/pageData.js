"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import * as pageDataController from "../controllers/pageDataController";
import express from "express";
const router = express.Router();
router.get("/blogs", pageDataController.getBlogs);
router.post("/ask", pageDataController.ask);
router.post("/subscribe", pageDataController.subscribe);
exports.default = router;
