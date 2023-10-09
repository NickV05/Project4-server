import * as pageDataController from "../controllers/pageDataController.js";
import express from "express";
// import isAuthenticated from "../middleware/isAuthenticated";
const router = express.Router();
router.get("/blogs", pageDataController.getBlogs);
router.post("/ask", pageDataController.ask);
router.post("/subscribe", pageDataController.subscribe);
export default router;
