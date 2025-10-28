import express from "express"
import dotenv from 'dotenv'
import {connectDB} from './lib/db.js'
import authroutes from './routes/authroutes.js'

dotenv.config()
const app=express()

const PORT = process.env.PORT
app.use(express.json())
app.use('/api/auth',authroutes)

connectDB()
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})