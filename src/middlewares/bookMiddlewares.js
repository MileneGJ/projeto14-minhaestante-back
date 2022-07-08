import { newBookSchema } from "../schemas/bookSchemas.js"

export function validateNewBook (req,res,next) {
    const validation = newBookSchema.validate(req.body);
    if(validation.error){
        return res.status(422).send(validation.error.details.message)
    } else {
        res.locals.newBook = req.body;
        next()
    }
}