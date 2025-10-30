import express from 'express'
import { createGame } from '../controllers/game.controllers'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/createGames',protect,createGame)

export default router