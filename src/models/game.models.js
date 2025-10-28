const mongoose=require('mongoose')

const gameSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true

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
    },
    duration: {
        type: Number,
        default: 60
    },
    location: {
        venuName: String,
        address: {
            type: String,
            required: true
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
            ref: 'user'
        }
    ],
    skillLevel: {
        type: String,
        enum: ['any', 'beginnner', 'intermediate', 'advanced'],
        default: 'any'
    },
    status: {
        type: String,
        enum: ['open', 'full', 'completed', 'cancelled'],
        default: 'open',
        index: true
    },
    invitedPlayers: [{
        type: mongoose.Schema.Types.String,
        ref: 'user'
    }],

    completedAt: Date,

    attendance: [{
        playerId: {
            type: mongoose.Schema.Types.String,
            ref: 'user'
        },
        status:{
            type:String,
            enum:['attended','no-show']
        }
    }],



},{timestamps:true});

const model=mongoose.model("Game",game);

module.exports={
    model
}