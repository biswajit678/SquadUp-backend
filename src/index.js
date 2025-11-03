import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import user from './routes/authroutes.js'
import gameroutes from './routes/gameroutes.js'
import invitation from './routes/invitationroutes.js'
import rating from './routes/ratingroutes.js'

dotenv.config()
const app=express()

app.use(cors());

const PORT = process.env.PORT
app.use(express.json())
app.use('/api/user',user)
app.use('/api/game',gameroutes)
app.use('/api/invitation',invitation)
app.use('/api/rating',rating)

connectDB()
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})