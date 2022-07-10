import { Router } from "express";
import {
  signIn,
  signUp,
  deleteUser,
  putUser,
} from "../controllers/authControllers.js";
import {
  signInMiddleware,
  signUpMiddleware,
} from "../middlewares/userMiddleware.js";
const router = Router();

router.post("/sign-up", signUpMiddleware, signUp);
router.post("/sign-in", signInMiddleware, signIn);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", putUser);
export default router;
