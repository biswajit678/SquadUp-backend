import User from "../models/auth.models.js"; 
export const getPlayers = async (req, res) => {
    try {
        const Players = await User.find({})
            .select('name email profilePic bio location sports availability overallRating totalGamesPlayed')
            .lean(); 
        
        if (!Players || Players.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No players found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Players loaded successfully",
            Players
        });
        
    } catch (error) {
        console.log("Failed to load Players", error);
        res.status(500).json({
            success: false,
            message: "Server error loading players",
            error: error.message,
        });
    }
};