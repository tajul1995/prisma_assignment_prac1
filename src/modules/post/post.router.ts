import express from 'express'
import { postController } from './post.controllert'
import auth, { UserRole } from '../../middleWare/auth'



const router= express.Router()
router.get('/',postController.findAllPost)
router.get('/:postId',postController.findPostById)
router.get('/my-posts/allpost',auth(UserRole.ADMIN,UserRole.USER),postController.getMyPosts)
router.patch('/my-posts/allpost/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.updateUserOwnPost)
router.post('/',auth(UserRole.ADMIN,UserRole.USER),postController.createPost)


export const postRouter=router
