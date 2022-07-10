import { Router } from "express";
import {
  signIn,
  signUp,
  deleteUser,
  putUser,
  addToUserCollection
} from "../controllers/authControllers.js";
import {
  signInMiddleware,
  signUpMiddleware,
  verifyBookEntry
} from "../middlewares/userMiddleware.js";
import { tokenVerify } from "../middlewares/tokenVerify.js";
const router = Router();

router.post("/sign-up", signUpMiddleware, signUp);
router.post("/sign-in", signInMiddleware, signIn);
router.post("/users/:field/:id", tokenVerify, verifyBookEntry, addToUserCollection)
router.delete("/users/:id", tokenVerify, deleteUser);
router.put("/users/:id", tokenVerify, putUser);
export default router;
