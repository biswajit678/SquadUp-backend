import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDb Connected: ${connect.connection.host}`);
        
    } catch (error) {
        console.log("MongoDb Connection Error",error);
        
    }
}