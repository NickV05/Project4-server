"use strict";
import * as pageDataController from "../controllers/pageDataController.js";
import express from "express";
const router = express.Router();
router.get("/blogs", pageDataController.getBlogs);
router.post("/ask", pageDataController.ask);
router.post("/subscribe", pageDataController.subscribe);
router.post("/getTime", pageDataController.getTimeSlots);
export default router;
