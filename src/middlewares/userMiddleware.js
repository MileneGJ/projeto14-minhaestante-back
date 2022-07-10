import signUpSchema from "../schemas/signUpSchema.js";
import signInSchema from "../schemas/signInSchema.js";
import { newBookSchema } from "../schemas/bookSchemas.js";

export function signUpMiddleware(req, res, next) {
  const validation = signUpSchema.validate(req.body);
  if (validation.error) {
    console.log(validation.error)
    return res.sendStatus(422);
  }
  next();
}

export function signInMiddleware(req, res, next){
  const validation = signInSchema.validate(req.body);
  if (validation.error) {
    console.log(validation.error)
    return res.sendStatus(422);
  }
  next();
}

export function verifyBookEntry (req,res,next){
  const formatToValidate = {
    title:req.body.title,
    description:req.body.description,
    author:req.body.author,
    price:req.body.price,
    type:req.body.type,
    genre:req.body.genre,
    image:req.body.image,
    publisher:req.body.publisher,
    pages:req.body.pages,
    userID:req.body.userID
  }
  
  const validation = newBookSchema.validate(formatToValidate);
  if (validation.error) {
    console.log(validation.error.details[0].message)
      return res.status(422).send(validation.error.details[0].message)
  } else {
      res.locals.newBook = req.body;
      next()
  }

}