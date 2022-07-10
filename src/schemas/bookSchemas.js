import joi from 'joi';

export const newBookSchema = joi.object({
    title:joi.string().required(),
    description:joi.string().min(5).required(),
    author:joi.string().required(),
    price:joi.string().regex(/^R\$[0-9]+\,[0-9]{2}$/).required(),
    type:joi.string().valid('ebook','livro físico').required(),
    genre:joi.string().required(),
    image:joi.string().uri(),
    publisher:joi.string(),
    pages:joi.number(),
    userID:joi.string()
})