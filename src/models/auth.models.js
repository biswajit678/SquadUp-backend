import mongoose from "mongoose";

const user = new mongoose.Schema({
    name :{
        type:String,
        requied:true,
        trim:true
    },
    email:{
        type:String,
        requied:true,
        unique:true,
        lowercase:true
    },
    password: {
        type:String,
        requied:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default:"https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
    },
    bio:{
        type:String,
        maxlength:500
    },
    location:{
        city:String,
        adress:String
    },
    sports:[
        {
            name:{
                type:String,
                
            },
            skillLevel:{
                type:String,
                enum:["Beginner","Intermediate","Advanced","Professional"]
            },
            averageRating:{
                type:Number,
                default:0,
                max:0,
                min:0
            },
            totalRatings:{
                type:Number,
                default:0
            },
            gamesPlayed:{
                type:Number,
                default:0
            }
        }
    ],
    availability:{
        type:String,
        enum:["Available","Busy","Not Available"],
        default:"Available"
    },
    oberallRating:{
        type:Number,
        default:0,
        min:0,
        max:5
    },
    totalGamesPlayed:{
        type:Number,
        default:0
    }
},{timestamps:true})

const User = mongoose.model("User",user)

export default User