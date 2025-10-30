import express from 'express'
import { createGame } from '../controllers/game.controllers'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/createGames',protect,createGame)
router.get("/game/getAllGames", getAllGames);
router.get("/game/getGameById/:gameId", getGameById);
router.put("/game/cancel/:gameId", protect, cancelGame);

