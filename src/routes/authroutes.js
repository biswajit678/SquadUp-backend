import express, { Router } from 'express'
import { login, Signup } from '../controllers/user.controllers.js'

const router = express.Router()

router.post('/signup',Signup)
router.post('/login',login)

export default router