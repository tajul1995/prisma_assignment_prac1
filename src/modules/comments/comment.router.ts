
import express from 'express'
import { commentController } from './comment.controller'

import auth, { UserRole } from '../../middleWare/auth'
const router =express.Router()
router.post('/',auth(UserRole.ADMIN,UserRole.USER)  ,commentController.createComment)
router.get('/:commentId',commentController.getCommentById)
router.get('/author/:commentId',commentController.getCommentByauthor)
export const commentRouter=router