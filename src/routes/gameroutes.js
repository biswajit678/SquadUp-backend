import express, { Router } from 'express'
import { getAllGames, getGameById, cancelGame } from '../controllers/game.controllers';
import { protect } from "../middleware/authMiddleware"
const router = express.Router()

router.get("/game/getAllGames", getAllGames);
router.get("/game/getGameById/:gameId", getGameById);
router.put("/game/cancel/:gameId", protect, cancelGame);

