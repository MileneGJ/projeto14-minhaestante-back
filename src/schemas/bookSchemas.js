import joi from 'joi';

export const newBookSchema = joi.object({
    title:joi.string().required(),
    description:joi.string().min(5).required(),
    author:joi.string().required(),
    publisher:joi.string().required(),
    type:joi.string().valid('ebook','livro físico').required(),
    genre:joi.string().required(),
    image:joi.string().uri(),
    ISBN:joi.string().regex(/[0-9]{10,13}/),
    pages:joi.number()
})