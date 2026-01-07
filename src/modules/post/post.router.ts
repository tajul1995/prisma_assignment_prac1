import express from 'express'
import { postController } from './post.controllert'
import auth, { UserRole } from '../../middleWare/auth'



const router= express.Router()

router.post('/',auth(UserRole.ADMIN,UserRole.USER) , postController.createPost)
router.get('/',postController.findAllPost)
router.get('/:postId',postController.findPostById)

export const postRouter=router
