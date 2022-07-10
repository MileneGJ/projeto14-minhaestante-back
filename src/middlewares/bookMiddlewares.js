import { newBookSchema } from "../schemas/bookSchemas.js"
import { db } from '../dbStrategy/mongodb.js'

export function validateNewBook(req, res, next) {
    const validation = newBookSchema.validate(req.body);
    if (validation.error) {
        return res.status(422).send(validation.error.details[0].message)
    } else {
        res.locals.newBook = req.body;
        next()
    }
}

export async function checkSearchByKeywords(req, res, next) {
    const { keyword, field } = req.query;

    if (keyword && field) {
        let search
        switch (field) {
            case "title":
                search = { title: keyword }
                break;
            case "author":
                search = { author: keyword }
                break;
            case "genre":
                search = { genre: keyword }
                break;
            case "publisher":
                search = { publisher: keyword }
                break;
            case "type":
                search = { type: keyword }
                break;
            case "userID":
                search = { userID: keyword }
                break;
            default:
                break;
        }
        try {
            const searchOutput = await db.collection("books").find(search).toArray()
            res.locals.listBooks = searchOutput;
            next()
        } catch (error) {
            console.log(error)
        }
    } else {
        next()
    }
}