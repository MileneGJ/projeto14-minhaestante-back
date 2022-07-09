import {Router} from 'express';
import { createBook, listAllBooks } from '../controllers/bookControllers.js';
import { checkSearchByKeywords, validateNewBook } from '../middlewares/bookMiddlewares.js';

const router = Router()

router.post("/books",validateNewBook,createBook)
router.get("/books",checkSearchByKeywords,listAllBooks)

export default router