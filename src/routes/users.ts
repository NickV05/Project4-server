import * as usersController from "../controllers/userController";
import  express  from "express";
const router = express.Router();
router.get("/",usersController.getUser);

export default router;