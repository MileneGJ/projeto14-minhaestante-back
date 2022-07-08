import {Router} from 'express';
import { createBook, listAllBooks } from '../controllers/bookControllers.js';

const router = Router()

router.post("/books",createBook)
router.get("/books",listAllBooks)

export default router