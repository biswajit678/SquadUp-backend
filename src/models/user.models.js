import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: "https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
    },
    bio: {
        type: String,
        maxlength: 500
    },
    location: {
        city: String,
        address: String
    },
    sports: [
        {
            name: {
                type: String,
                index: true 
            },
            skillLevel: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Professional"]
            },
            averageRating: {
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },
            totalRatings: {
                type: Number,
                default: 0
            },
            gamesPlayed: {
                type: Number,
                default: 0
            }
        }
    ],
    availability: {
        type: String,
        enum: ["Available", "Busy", "Not Available"],
        default: "Available"
    },
    overallRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalGamesPlayed: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

userSchema.index({ 'location.city': 1, 'sports.name': 1 });

const User = mongoose.model("User", userSchema);

export default User;