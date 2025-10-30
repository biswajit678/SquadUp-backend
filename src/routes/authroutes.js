import express, { Router } from 'express'
import { login, Signup, getMyProfile } from '../controllers/auth.controllers.js'

const router = express.Router()

router.post('/signup', Signup)
router.post('/login', login)
router.get('/getMyProfile', getMyProfile)


export default router;