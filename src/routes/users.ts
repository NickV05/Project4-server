import * as usersController from "../controllers/userController";
import  express  from "express";
const router = express.Router();

router.get("/",usersController.getUser);
router.post("/signup", usersController.createUser);
router.post("/login", usersController.login);
export default router;