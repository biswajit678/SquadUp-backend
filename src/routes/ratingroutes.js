import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addRatings, averageRatings, getAllRating } from '../controllers/rating.controllers.js'

const router = express.Router()

router.post('/rating',protect,addRatings)

router.get('/rating/all',protect,getAllRating)

router.get('/router/avg',protect,averageRatings)

export default router