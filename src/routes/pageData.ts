const pageDataController = require("../controllers/pageDataController");
const express = require("express");
const router = express.Router();

router.get("/blogs", pageDataController.getBlogs);
router.post("/ask", pageDataController.ask);
router.post("/subscribe", pageDataController.subscribe);
router.post("/getTime", pageDataController.getTimeSlots);

export default router;