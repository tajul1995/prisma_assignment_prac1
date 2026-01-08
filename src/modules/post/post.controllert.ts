import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelpers from "../../helpers/paginationSortingHelpers";

const createPost=async(req:Request,res: Response)=>{
    try {
        const post=req.body
        const fulluser=req.user
        // console.log(post,fulluser)
         const result = await postService.createPost(post,fulluser?.id as string)
         console.log(result)
         res.status(200).json({
            success:true,
            message:'post created successfully',
            data:result
        })
    } catch (error:any) {
        res.status(404).json({
            success:false,
            message:'post created failed',
            data:error.message
        })
    }
   
}
const findAllPost=async(req:Request,res: Response)=>{
    try {
        //  console.log(req.query)
        const {search}=req.query
        const searchVerification = typeof search==="string"?search:undefined
        const allTags=req.query.tags?(req.query.tags as string).split(","):[]
        const isFeatured= req.query.isFeatured?req.query.isFeatured==='true'?true:req.query.isFeatured==='false'?false:undefined
        :undefined
        
        const status=req.query.status
        const authorId=req.query.authorId
        // const pages=Number(req.query.pages ?? 1)
        // const limit=Number(req.query.limit ?? 10)
        // const skip=(pages-1)*limit
        // const sortBy=req.query.sortBy as string || undefined
        // const sortOrder=req.query.sortOrder as string || undefined
        const options= paginationSortingHelpers(req.query)
        const {pages,limit,skip,sortBy,sortOrder}=options
        
         const result = await postService.findAllPost(searchVerification as string,allTags,isFeatured as boolean,status as PostStatus,authorId as string|undefined,pages,limit,skip,sortBy as string,sortOrder as string)
         res.status(200).json({
            success:true,
            message:'find all   post  successfully',
            data:result
        })
    } catch (error:any) {
        res.status(404).json({
            success:false,
            message:'post find  failed',
            data:error.message
        })
    }
   
}

const findPostById=async(req:Request,res:Response)=>{
    try {
            const {postId}=req.params
            if(!postId){
                throw new Error("id not valied")
            }
         const result = await postService.findPostById(postId as string)
         console.log(result)
         res.status(200).json({
            success:true,
            message:'post created successfully',
            data:result
        })
    } catch (error:any) {
        res.status(404).json({
            success:false,
            message:'post created failed',
            data:error.message
        })
    }
   

}

const getMyPosts=async(req:Request,res:Response)=>{

    try {
            const user= req.user
            // console.log(user)
            if(!user){
                throw new Error("user is not valied")
            }
            
         const result = await postService.getMyPosts(user.id)
        //  console.log(user)
         res.status(200).json({
            success:true,
            message:' get my post  successfully',
            data:result
        })
    } catch (error:any) {
        console.log(error)
        res.status(404).json({
            success:false,
            message:'post get fetch failed',
            data:error.message
        })
    }
   

}


const updateUserOwnPost=async(req:Request,res:Response)=>{

    try {
            const user= req.user
            const {postId}=req.params
            // console.log(user)
            if(!user){
                throw new Error("user is not valied")
            }
            
         const result = await postService.updateUserOwnPost(postId as string,req.body,user.id)
        //  console.log(user)
         res.status(200).json({
            success:true,
            message:' updated post  successfully',
            data:result
        })
    } catch (error:any) {
        console.log(error)
        res.status(404).json({
            success:false,
            message:'post does not updated failed',
            data:error.message
        })
    }
   

}


export const postController={
        createPost,
        findAllPost,
        findPostById,
        getMyPosts,
        updateUserOwnPost
}