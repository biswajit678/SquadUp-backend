import User from "../models/auth.models.js";
import Game from "../models/game.models.js";

export const createGame = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            sport,
            title,
            description,
            date,
            duration,
            location,
            playersNeeded,
            skillLevel
        } = req.body;

        if (!sport || !title || !description || !date || !duration || !location || !playersNeeded || !skillLevel) {
            return res.status(400).json({ message: "You have missed Something" })
        }

        const gameDate = new Date(date);
        const startOfDay = new Date(gameDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(gameDate.setHours(23, 59, 59, 999));

        const existingGames = await Game.find({
            $or: [
                { creator: userId },
                { currentPlayers: { $in: [userId] } }
            ],
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });


        if (existingGames.length > 0) {
            return res.status(400).json({
                message: "You already have a game scheduled on this day"
            });
        }
        const newgame = new Game({
            creator: userId,
            sport,
            title,
            description,
            date,
            duration,
            location,
            playersNeeded,
            currentPlayers: [userId],
            skillLevel
        });

        await newgame.save();

        return res.status(201).json({
            success: true,
            message: "Game created successfully",
            data: newgame
        })
    } catch (error) {
        console.error("Create game error:", error)
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const updateGame = async (req, res) => {
    try {
        const userId = req.user._id;
        const gameId = req.params.gameId;

        const {
            sport,
            title,
            description,
            date,
            duration,
            location,
            playersNeeded,
            skillLevel
        } = req.body;

        const game = await Game.findById(gameId);

        if (['completed', 'cancelled'].includes(game.status)) {
            return res.status(400).json({
                message: "Cannot update a completed or cancelled game"
            });
        }

        if (!game) {
            return res.status(404).json({ message: "Game not found" })
        }

        if (game.creator.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this game" })
        }

        if (sport) game.sport = sport;
        if (title) game.title = title;
        if (description) game.description = description;
        if (date) game.date = date;
        if (duration) game.duration = duration;
        if (location) game.location = location;
        if (playersNeeded) game.playersNeeded = playersNeeded;
        if (skillLevel) game.skillLevel = skillLevel;

        const updatedGame = await game.save();

        return res.status(200).json({
            success: true,
            message: "Game updated successfully",
            data: updatedGame
        })
    } catch (error) {
        console.error("Update game error:", error)
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}

export const cancelGame = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.user._id;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            })
        }

        if (userId.toString() !== game.creator.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to cancel this game"
            })
        }

        // Check if game is already cancelled
        if (game.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Game is already cancelled"
            })
        }

        // Automatically set status to cancelled
        game.status = 'cancelled';
        await game.save();

        return res.status(200).json({
            success: true,
            message: "Game cancelled successfully"
        })

    } catch (error) {
        console.error("Cancel game error:", error)
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

export const getAllGames = async (req, res) => {
    try {

        const games = await Game.find({
            status: { $ne: 'cancelled' }
        })
            .populate('creator', 'name email')
            .populate('currentPlayers', 'name email profilePic')
            .sort({ date: 1 });

        const gamesWithCorrectStatus = games.map(game => {
            const gameObj = game.toObject();
            const currentPlayerCount = gameObj.currentPlayers?.length || 0;

            if (gameObj.status !== 'cancelled' && gameObj.status !== 'completed') {
                gameObj.status = currentPlayerCount >= gameObj.playersNeeded ? 'full' : 'open';
            }

            return gameObj;
        })

        return res.status(200).json({
            success: true,
            count: gamesWithCorrectStatus.length,
            data: gamesWithCorrectStatus
        })
    } catch (error) {
        console.error("Get all games error:", error)
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

export const getGameById = async (req, res) => {
    try {
        const gameId = req.params.gameId;

        const game = await Game.findById(gameId)
            .populate('creator', 'name email profilePic')
            .populate('currentPlayers', 'name email profilePic');

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: game
        })

    } catch (error) {
        console.error("Get game by id error:", error)
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}

export const getMyGames = async (req, res) => {
    try {
        const userId = req.user._id;
        const games = await Game.find({
            status: { $ne: 'cancelled' }, 
            $or: [
                { creator: userId },
                { currentPlayers: { $in: [userId] } }
            ]
        })
        .populate('creator', 'name email')
        .populate('currentPlayers', 'name email profilePic')
        .sort({ date: 1 });

        const gamesWithCorrectStatus = games.map(game => {
            const gameObj = game.toObject();
            const currentPlayerCount = gameObj.currentPlayers?.length || 0;

            if (gameObj.status !== 'cancelled' && gameObj.status !== 'completed') {
                gameObj.status = currentPlayerCount >= gameObj.playersNeeded ? 'full' : 'open';
            }
            
            return gameObj;
        });

        return res.status(200).json({
            success: true,
            count: gamesWithCorrectStatus.length,
            data: gamesWithCorrectStatus
        })

    } catch (error) {
        console.error("Get my games error:", error)
        return res.status(500).json({ 
            success: false,
            message: "Server Error", 
            error: error.message 
        })
    }
}

export const getUpcomingGames = async (req, res) => {
    try {
        const games = await Game.find({
            date: { $gt: new Date() }
        })

        return res.status(200).json({
            success: true,
            count: games.length,
            data: games
        })
    } catch (error) {
        console.error("Cancel game error:", error)
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}

export const getPastGames = async (req, res) => {
    try {
        const games = await Game.find({
            date: { $lt: new Date() }
        })

        return res.status(200).json({
            success: true,
            count: games.length,
            data: games
        })
    } catch (error) {
        console.error("Cancel game error:", error)
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}

