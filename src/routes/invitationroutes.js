import express from 'express'
import { acceptInvitation, cancelInvitation, getInvitationsForGame, getMyInvitation, rejectInvitation, sendInvitation } from '../controllers/invitation.controllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/invitation/senderId',protect,sendInvitation)

router.post('/invitation/reciverId/accept',protect,acceptInvitation)

router.post('/invitation/reciver/reject',protect,rejectInvitation)

router.get('/invitation/myInvitation',protect,getMyInvitation)  

router.put('/invitation/cancel',protect,cancelInvitation)

router.get('/invitation/getAll',getInvitationsForGame)

export default router