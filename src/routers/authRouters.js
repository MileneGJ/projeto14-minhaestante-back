import { Router } from "express";
import { signIn, signUp } from "../controllers/authControllers.js";
import{signInMiddleware, signUpMiddleware} from "../middlewares/userMiddleware.js"
const router = Router();

router.post("/sign-up", signUpMiddleware, signUp);
router.post("/sign-in", signInMiddleware, signIn);

export default router;
