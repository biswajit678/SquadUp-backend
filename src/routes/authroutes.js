import express from 'express'
import { login, Signup, getMyProfile } from '../controllers/auth.controllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', Signup)

router.post('/login', login)

router.get('/getMyProfile',protect, getMyProfile)


export default router;