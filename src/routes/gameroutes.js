import express from 'express'
import { cancelGame, createGame, getAllGames, getGameById, getMyGames, getPastGames, getUpcomingGames, updateGame } from '../controllers/game.controllers.js'
import { protect } from '../middleware/authMiddleware.js'
import { joinGame, leaveGame } from '../controllers/gameParticipate.controllers.js'

const router = express.Router()

router.post('/game/create',protect,createGame)

router.put('/game/user/:gameId',protect,updateGame)

router.get("/game/all",protect, getAllGames);

router.get("/game/myGames",protect,getMyGames)

router.get("/game/:gameId",protect, getGameById);

router.put("/game/cancel/:gameId", protect, cancelGame)

router.get("/game/upcoming",protect,getUpcomingGames)

router.get("/game/past",protect,getPastGames)

router.put("/game/join",protect,joinGame)

router.put("/game/leaveGame/:gameId",protect,leaveGame)

export default router