import Game from "../models/game.models"

export const createGame = async (req, res) => {
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
        if (!sport || !title || !description || !date || !duration || !location || !playersNeeded || !skillLevel) {
            res.status(400).json({ message: "You have missed Something" })
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
            skillLevel
        })
        await newgame.save()
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export const updateGame = async (req, res) => {
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

        if (!game) {
            return res.status(401).json({ message: "" })
        }
        if (!sport) game.sport = sport
        if (!title) game.title = title
        if (!description) game.description = description
        if (!date) game.date = date
        if (!duration) game.duration = duration
        if (!location) game.location = location
        if (!playersNeeded) game.playersNeeded = playersNeeded
        if (!skillLevel) game.skillLevel = skillLevel

        const updatedGames = await game.save()
        return res.status(200).json({ message: "Games Updated Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

export const getAllGames = async (req, res) => {
    try {
        const games = await Game.find();
        if (!games) {
            return res.status(400).json({
                success: false,
                message: "no game found"
            })
        }
        return res.status(200).json({
            success: true,
            data: games
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getGameById = async (req, res) => {
    try {
        const gameId = req.params;

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(400).json({
                success: false,
                message: "no game found"
            })
        }

        return res.status(200).json({
            success: true,
            data: game
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const cancelGame = async (req, res) => {
    try {
        const { status } = req.body;
        const gameId = req.params;
        const userId = req.user._id;


        const gameStatuses = ['open', 'full', 'completed', 'cancelled'];

        if (!gameStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "not a valid status"
            })
        }

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(400).json({
                success: false,
                message: "no game found"
            })
        }

        if (userId !== game._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "you dont have access to this game"
            })
        }

        game.status = status;
        await game.save();

        return res.status(200).json({
            success: true,
            message: "game cancelled"
        })


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}