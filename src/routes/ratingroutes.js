import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addRatings, averageRatings, getAllRating } from '../controllers/rating.controllers.js'

const router = express.Router()

router.post('/',protect,addRatings)

router.get('/all',protect,getAllRating)

router.get('/avg',protect,averageRatings)

export default router