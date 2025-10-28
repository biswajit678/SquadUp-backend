import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    sport: {
        type: String,
        required: true,
        index: true 
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    date: {
        type: Date,
        required: true,
        index: true 
    },
    duration: {
        type: Number,
        default: 60 
    },
    location: {
        venueName: String,
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            index: true 
        }
    },
    playersNeeded: {
        type: Number,
        required: true,
        min: 2
    },
    currentPlayers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    skillLevel: {
        type: String,
        enum: ['any', 'beginner', 'intermediate', 'advanced'],
        default: 'any',
        index: true 
    },
    status: {
        type: String,
        enum: ['open', 'full', 'completed', 'cancelled'],
        default: 'open',
        index: true 
    },
    invitedPlayers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    completedAt: Date,
    attendance: [{
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['attended', 'no-show']
        }
    }]
}, { timestamps: true });

gameSchema.index({ sport: 1, date: 1, status: 1 }); 
gameSchema.index({ 'location.city': 1, sport: 1, date: 1 }); 
gameSchema.index({ creator: 1, status: 1 }); 

const Game = mongoose.model("Game", gameSchema);

export default Game;