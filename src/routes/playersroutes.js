import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getPlayers } from '../controllers/players.controller.js';
const router = express.Router()

router.get("/getPlayers",protect,getPlayers);

export default router;