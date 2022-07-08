import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouters from './routers/authRouters.js'
import bookRouters from './routers/bookRouters.js'


dotenv.config()

const app = express();

app.use(express.json(),cors());

app.use(authRouters)
app.use(bookRouters)

app.listen(process.env.PORT,()=>{
    console.log(`Listening on ${process.env.PORT}`)
})