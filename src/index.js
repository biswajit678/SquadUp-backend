import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import user from './routes/authroutes.js';
import gameroutes from './routes/gameroutes.js';
import invitation from './routes/invitationroutes.js';
import rating from './routes/ratingroutes.js';
import players from './routes/playersroutes.js';
import "./util/gameScheduler.js";

dotenv.config()
const app=express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}
));

const PORT = process.env.PORT
app.use(express.json())
app.use('/api/user',user)
app.use('/api/game',gameroutes)
app.use('/api/invitation',invitation)
app.use('/api/rating',rating)
app.use('/api/players',players)


connectDB()
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})