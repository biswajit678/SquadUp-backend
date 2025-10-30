import Game from '../models/game.models';

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