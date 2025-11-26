import cron from "node-cron";
import Game from "../models/game.models.js"; 

cron.schedule("0 0 * * *", async () => {
    try {
        const now = new Date();

        const result = await Game.updateMany(
            {
                date: { $lt: now },
                status: { $in: ['open', 'full'] }
            },
            {
                $set: {
                    status: 'completed',
                    completedAt: now
                }
            }
        );

        console.log(`[${new Date().toISOString()}] Updated ${result.modifiedCount} expired games to completed`);
        
    } catch (error) {
        console.error('Error updating expired games:', error);
    }
});

console.log('Game status cron job started - runs every  minutes');