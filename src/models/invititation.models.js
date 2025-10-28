import mongoose from "mongoose";

const invitationSchema = mongoose.Schema({

    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
     receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    message:{
        type:String,
        default:'Join my game!',
        maxlength:500
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected','expired'],
        default:'pending',
        index:true
    },
    sendAt:{
        type:Date,
        default:Date.now
    },
    respondedAt:Date,
    expiresAt:{
        type:Date,
        default:()=>Date.now()+(48*60*60*1000)
    }

})

const model=mongoose.model("invitation")

module.exports={
    model
}