
import express from 'express'
import { commentController } from './comment.controller'

import auth, { UserRole } from '../../middleWare/auth'
const router =express.Router()
router.post('/',auth(UserRole.ADMIN,UserRole.USER)  ,commentController.createComment)
router.get('/:commentId',commentController.getCommentById)
router.get('/author/:commentId',commentController.getCommentByauthor)
router.delete('/:commentId',auth(UserRole.ADMIN,UserRole.USER)  ,commentController.deleteCommentById)
router.patch('/:commentId',auth(UserRole.ADMIN,UserRole.USER)  ,commentController.updateComment)
router.patch('/:commentId/moderate',auth(UserRole.ADMIN)  ,commentController.moderateCommentStatus)
export const commentRouter=router