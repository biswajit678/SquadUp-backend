import express from 'express'
import { cancelGame, createGame, getAllGames, getGameById, getMyGames, getPastGames, getUpcomingGames, updateGame } from '../controllers/game.controllers.js'
import { protect } from '../middleware/authMiddleware.js'
import { joinGame, leaveGame } from '../controllers/gameParticipate.controllers.js'

const router = express.Router()

router.post('/create',protect,createGame)

router.put('/user/:gameId',protect,updateGame)

router.get("/all",protect, getAllGames);

router.get("/myGames",protect, getMyGames)

router.put("/cancel/:gameId", protect, cancelGame)

router.get("/upcoming",protect,getUpcomingGames)

router.get("/past",protect,getPastGames)

router.put("/join/:gameId",protect,joinGame)

router.put("/leaveGame/:gameId",protect,leaveGame)

router.get("/:gameId",protect, getGameById);

export default router