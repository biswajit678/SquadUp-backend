import express from 'express'
import { acceptInvitation, cancelInvitation, getInvitationsForGame, getMyInvitation, rejectInvitation, sendInvitation } from '../controllers/invitation.controllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/senderId',protect,sendInvitation)

router.post('/reciverId/accept',protect,acceptInvitation)

router.post('/reciver/reject',protect,rejectInvitation)

router.get('/myInvitation',protect,getMyInvitation)  

router.put('/cancel',protect,cancelInvitation)

router.get('/getAll',getInvitationsForGame)

export default router