import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
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
    message: {
        type: String,
        default: 'Join my game!',
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'expired'],
        default: 'pending',
        index: true 
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: Date,
    expiresAt: {
        type: Date,
        default: () => Date.now() + (48 * 60 * 60 * 1000) // 48 hours
    }
}, { timestamps: true });

invitationSchema.index({ receiverId: 1, status: 1 }); 
invitationSchema.index({ gameId: 1, status: 1 });
invitationSchema.index({ senderId: 1, gameId: 1 }); 

invitationSchema.index({ gameId: 1, senderId: 1, receiverId: 1 }, { unique: true });

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;