import express from 'express'
import { login, Signup, getMyProfile } from '../controllers/auth.controllers.js'
import { protect } from '../middleware/authMiddleware.js'
import { profileUpload, setAvailability, updateProfile } from '../controllers/profile.controllers.js'

const router = express.Router()

router.post('/signup', Signup)

router.post('/login', login)

router.get('/profile/me',protect, getMyProfile)

router.put('/profile/picture',protect,profileUpload)

router.put('/profile/update',protect,updateProfile)

router.put('/profile/availability',protect,setAvailability)

export default router;