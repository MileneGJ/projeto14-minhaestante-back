import {Router} from 'express';
import { createBook, listAllBooks } from '../controllers/bookControllers.js';
import { validateNewBook } from '../middlewares/bookMiddlewares.js';

const router = Router()

router.post("/books",validateNewBook,createBook)
router.get("/books",listAllBooks)

export default router