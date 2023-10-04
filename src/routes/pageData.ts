import * as pageDataController from "../controllers/pageDataController";
import  express  from "express";
// import isAuthenticated from "../middleware/isAuthenticated";
const router = express.Router();

router.get("/blogs", pageDataController.getBlogs);
router.post("/ask", pageDataController.ask);

export default router;