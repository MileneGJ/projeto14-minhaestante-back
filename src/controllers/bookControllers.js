import { db } from "../dbStrategy/mongodb.js";

export async function createBook(_, res) {
    try {
        await db.collection("books").insertOne(res.locals.newBook)
        return res.sendStatus(201)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export async function listAllBooks(_, res) {
    if (res.locals.listBooks) {
        return res.status(200).send(res.locals.listBooks)
    } else {
        try {
            const AllBooks = await db.collection("books").find().toArray()
            return res.status(200).send(AllBooks)
        } catch (error) {
            console.log(error)
            return res.sendStatus(400)
        }
    }
}

export async function listUserBooks (req,res) {
    const { userID } = req.params;
    try {
        const searchOutput = await db.collection("books").find({userID}).toArray()
        return res.status(200).send(searchOutput)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}