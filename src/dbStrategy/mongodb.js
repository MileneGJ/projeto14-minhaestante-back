import {MongoClient, ObjectId} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;
client.connect(() => {
    db = client.db(process.env.DATABASE);
});

const objectId = ObjectId;

export { db, objectId };