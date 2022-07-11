import {Router} from 'express';
import { createBook, listAllBooks, listUserBooks } from '../controllers/bookControllers.js';
import { checkSearchByKeywords, validateNewBook } from '../middlewares/bookMiddlewares.js';
import { tokenVerify } from '../middlewares/tokenVerify.js';

const router = Router()

router.post("/books",tokenVerify,validateNewBook,createBook)
router.get("/books",checkSearchByKeywords,listAllBooks)
router.get("/books/user/:userID",tokenVerify,listUserBooks)

export default router