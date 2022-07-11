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

export function signInMiddleware(req, res, next) {
  const validation = signInSchema.validate(req.body);
  if (validation.error) {
    console.log(validation.error)
    return res.sendStatus(422);
  }
  next();
}

export function verifyBookEntry(req, res, next) {
  let formatToValidate
  if (req.body.length) {
    formatToValidate = []
    req.body.map(b => {
      formatToValidate.push({
        title: b.title,
        description: b.description,
        author: b.author,
        price: b.price,
        type: b.type,
        genre: b.genre,
        image: b.image,
        publisher: b.publisher,
        pages: b.pages,
        userID: b.userID
      })
      const validation = newBookSchema.validate(formatToValidate[formatToValidate.length - 1]);
      if (validation.error) {
        console.log(validation.error.details[0].message)
        return res.status(422).send(validation.error.details[0].message)
      }
    })
    res.locals.newBook = req.body;
    next()

  } else {
    formatToValidate = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      price: req.body.price,
      type: req.body.type,
      genre: req.body.genre,
      image: req.body.image,
      publisher: req.body.publisher,
      pages: req.body.pages,
      userID: req.body.userID
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


}