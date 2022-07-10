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
import { tokenVerify } from "../middlewares/tokenVerify.js";
const router = Router();

router.post("/sign-up", signUpMiddleware, signUp);
router.post("/sign-in", signInMiddleware, signIn);
router.delete("/users/:id", tokenVerify, deleteUser);
router.put("/users/:id", tokenVerify, putUser);
export default router;
