import Game from "../models/game.models.js";

export const joinGame = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.user._id;
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        if (['cancelled', 'completed'].includes(game.status?.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "This game is no longer available"
            });
        }

        if (game.currentPlayers.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have already joined this game",
            });
        }

        if (game.currentPlayers.length >= game.playersNeeded) {
            game.status = "full";
            await game.save();
            return res.status(400).json({
                success: false,
                message: "This game is already full",
            });
        }

        const gameDate = new Date(game.date);
        const startOfDay = new Date(gameDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(gameDate.setHours(23, 59, 59, 999));

        const existingGames = await Game.find({
            _id: { $ne: gameId }, 
            status: { $nin: ['cancelled', 'completed'] }, 
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
                success: false,
                message: "You already have a game scheduled on this day"
            });
        }

        game.currentPlayers.push(userId);

        if (game.currentPlayers.length >= game.playersNeeded) {
            game.status = "full";
        } else {
            game.status = "open";
        }

        await game.save();

        return res.status(200).json({
            success: true,
            message: "You have successfully joined the game",
            data: {
                id: game._id,
                sport: game.sport,
                currentPlayers: game.currentPlayers,
                status: game.status,
            },
        });

    } catch (error) {
        console.error("Error joining game:", error);
        res.status(500).json({
            success: false,
            message: "Server error joining game",
            error: error.message,
        });
    }
};

export const leaveGame = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.user._id;
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        if (['cancelled', 'completed'].includes(game.status?.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Cannot leave a ${game.status} game`
            });
        }

        if (game.creator.toString() === userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Game creator cannot leave the game. Please cancel the game instead."
            });
        }

        if (!game.currentPlayers.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have not joined this game"
            });
        }

        game.currentPlayers = game.currentPlayers.filter(
            (player) => player.toString() !== userId.toString()
        );

        if (game.currentPlayers.length >= game.playersNeeded) {
            game.status = "full";
        } else {
            game.status = "open";
        }

        await game.save();

        return res.status(200).json({
            success: true,
            message: "You have successfully left this game",
        });

    } catch (error) {
        console.error("Error leaving game:", error);
        res.status(500).json({
            success: false,
            message: "Server error leaving game",
            error: error.message,
        });
    }
};