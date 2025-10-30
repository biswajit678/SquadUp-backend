import Game from "../models/game.models"

export const createGame = async (req,res)=>{
    try {
        const userId = req.user._id

        const {
            sport,
            title,
            description,
            date,
            duration,
            location,
            playersNeeded,
            skillLevel

        } = req.body
        if(!sport || !title || !description || !date || !duration || !location || !playersNeeded || !skillLevel){
            res.status(400).json({message:"You have missed Something"})
        }

        const newgame = new Game({
            creator:userId,
            sport,
            title,
            description,
            date,
            duration,
            location,
            playersNeeded,
            skillLevel
        })
        await newgame.save()
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}

export const updateGame = async (req, res) =>{
    try {
        const urerId = req.user._id
        const {
            sport,
            title,
            description,
            date,
            duration,
            location,
            playersNeeded,
            skillLevel
        } = req.body

        const game = await Game.findById(userId).select("-password")

        if(!game) {
            return res.status(401).json({message:""})
        }
        if(!sport) game.sport=sport
        if(!title) game.title=title
        if(!description) game.description=description
        if(!date) game.date=date
        if(!duration) game.duration=duration
        if(!location)game.location=location
        if(!playersNeeded)game.playersNeeded=playersNeeded
        if(!skillLevel)game.skillLevel=skillLevel

        const updatedGames = await game.save()
        return res.status(200).json({message:"Games Updated Successfully"})
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}