import Game from "../models/game.models.js";
import Invitation from "../models/invitation.models.js";
import User from "../models/auth.models.js";

export const sendInvitation = async (req, res) => {
    try {
        const { gameId, receiverId, message } = req.body;
        const userId = req.user._id;

        if (!gameId || !receiverId) {
            return res.status(400).json({
                success: false,
                message: "Game ID and receiver ID are required"
            });
        }

        if (userId.toString() === receiverId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot invite yourself"
            });
        }

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        if (game.creator.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the game creator can send invitations"
            });
        }

        if (['full', 'completed', 'cancelled'].includes(game.status)) {
            return res.status(400).json({
                success: false,
                message: "This game is not accepting new players"
            });
        }

        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            });
        }
        if (["Busy", "Not Available"].includes(receiver.availability)) {
            return res.status(400).json({
                success: false,
                message: "The player is not available"
            });
        }

        if (game.currentPlayers.includes(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "This user has already joined the game"
            });
        }

        const existingInvitation = await Invitation.findOne({
            gameId,
            senderId: userId,
            receiverId,
            status: 'pending'
        });

        if (existingInvitation) {
            return res.status(400).json({
                success: false,
                message: "An invitation has already been sent to this user"
            });
        }

        const newInvitation = new Invitation({
            gameId,
            senderId: userId,
            receiverId,
            message: message || 'Join my game!',
            status: 'pending'
        })

        await newInvitation.save();

        if (!game.invitedPlayers.includes(receiverId)) {
            game.invitedPlayers.push(receiverId);
            await game.save();
        }

        await newInvitation.populate([
            { path: 'gameId', select: 'sport title date location' },
            { path: 'senderId', select: 'name profilePic' },
            { path: 'receiverId', select: 'name profilePic' }
        ]);

        return res.status(201).json({
            success: true,
            message: "Invitation sent successfully",
            data: newInvitation
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error sending invitation",
            error: error.message
        });
    }
}

export const acceptInvitation = async (req, res) => {
    try {
        const userId = req.user._id;
        const { invitationId } = req.params;

        const invitation = await Invitation.findById(invitationId);
        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found"
            });
        }

        if (invitation.receiverId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to accept this invitation"
            });
        }
        if (invitation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Invitation is already ${invitation.status}`
            });
        }

        const game = await Game.findById(invitation.gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        if (['completed', 'cancelled'].includes(game.status)) {
            invitation.status = 'expired';
            invitation.respondedAt = new Date();
            await invitation.save();

            return res.status(400).json({
                success: false,
                message: "Game is no longer available"
            });
        }

        if (game.currentPlayers.length >= game.playersNeeded) {
            invitation.status = 'expired';
            invitation.respondedAt = new Date();
            await invitation.save();

            return res.status(400).json({
                success: false,
                message: "Game is already full"
            });
        }

        if (game.currentPlayers.includes(userId)) {
            invitation.status = 'accepted';
            invitation.respondedAt = new Date();
            await invitation.save();

            return res.status(400).json({
                success: false,
                message: "You have already joined this game"
            });
        }

        game.currentPlayers.push(userId);

        if (game.currentPlayers.length >= game.playersNeeded) {
            game.status = 'full';
        }

        await game.save();

        invitation.status = 'accepted';
        invitation.respondedAt = new Date();
        invitation.save();

        return res.status(200).json({
            success: true,
            message: "Invitation accepted successfully",
            data: {
                invitation,
                game: {
                    id: game._id,
                    sport: game.sport,
                    title: game.title,
                    currentPlayers: game.currentPlayers,
                    status: game.status
                }
            }
        });


    } catch (error) {
        console.error("Accept invitation error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error accepting invitation",
            error: error.message
        });
    }
}

//reject invitation

export const rejectInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const userId = req.user._id;

        const invitation = await Invitation.findById(invitationId);

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found"
            });
        }

        if (invitation.receiverId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to reject this invitation"
            });
        }

        if (invitation.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Invitation is already ${invitation.status}`
            });
        }

        invitation.status = 'rejected';
        invitation.respondedAt = new Date();

        await invitation.save();

        return res.status(200).json({
            success: true,
            message: "Invitation rejected",
            data: invitation
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error sending invitation",
            error: error.message
        });
    }


}

//getmy invitation

export const getMyInvitation = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, type } = req.query;
        let query = {};
        if (type === 'sent') {
            query.senderId = userId;
        } else {
            query.receiverId = userId;
        }

        if (status && ['pending', 'accepted', 'rejected', 'expired'].includes(status)) {
            query.status = status;
        }
        const invitations = await Invitation.find(query)
            .populate('gameId', 'sport title date location status')
            .populate('senderId', 'name profilePic')
            .populate('receiverId', 'name profilePic')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: invitations.length,
            data: invitations
        });
    } catch (error) {
        console.error("Get invitations error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error fetching invitations",
            error: error.message
        });
    }
}

//cancel invitation

export const cancelInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const userId = req.user._id;

        const invitation = await Invitation.findById(invitationId);
        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found"
            });
        }
        if (invitation.senderId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the sender can cancel this invitation"
            });
        }
        if (invitation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Can only cancel pending invitations"
            });
        }

        await Invitation.findByIdAndDelete(invitationId);

        await Game.findByIdAndUpdate(invitation.gameId, {
            $pull: { invitedPlayers: invitation.receiverId }
        });

        return res.status(200).json({
            success: true,
            message: "Invitation cancelled successfully"
        });

    } catch (error) {
        console.error("Cancel invitation error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error cancelling invitation",
            error: error.message
        });
    }
}

//get all invitations for a game
export const getInvitationsForGame = async (req,res) => {
    try {
        const gameId = req.params;
        const game = await Game.findById(gameId)

        if(!game){
            return res.status(401).json({message:"Game not Found"})
        }

        const invitations = await Invitation.findById({gameId})
        .populate('senderId', 'name profilePic')
        .populate('receiverId','name profilePic')
        .sort({createdAt : -1})

        return res.status(200).json({
            success:true,
            count:invitations.length,
            data:invitations
        })
    } catch (error) {
        
         return res.status(500).json({
            success: false,
            message: "Server error fetching invitations for game",
            error: error.message
    });
    }
}