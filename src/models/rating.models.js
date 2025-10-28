import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
        index: true 
    },
    sport: {
        type: String,
        required: true,
        index: true 
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    reviewedPlayerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 1000
    }
}, { timestamps: true });

ratingSchema.index({ reviewedPlayerId: 1, sport: 1 });
ratingSchema.index({ reviewerId: 1, gameId: 1 }); 

ratingSchema.index({ gameId: 1, reviewerId: 1, reviewedPlayerId: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;