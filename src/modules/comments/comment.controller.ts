import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment=async(req:Request,res:Response)=>{
    try {
        const user=req.user
        req.body.authorId=user?.id
        const result=await commentService.createComment(req.body)
        res.status(200).json({
            success:true,
            message:'create comment successfully',
            data:result
        })
    } catch (error:any) {
        res.status(404).json({
            success:false,
            message:'dont create any comment',
            data:error.message
        })
    }
}
const getCommentById=async(req:Request,res:Response)=>{
    try {
        const {commentId}=req.params
        const result=await commentService.getCommentById(commentId as string)
        res.status(200).json({
            success:true,
            message:'get comment successfully',
            data:result
        })
    } catch (error:any) {
        res.status(404).json({
            success:false,
            message:'dont get any comment',
            data:error.message
        })
    }
}

const getCommentByauthor=async(req:Request,res:Response)=>{
    try {
        const {commentId}=req.params
        const result=await commentService.getCommentByauthor(commentId as string)
        res.status(200).json({
            success:true,
            message:'get comment successfully',
            data:result
        })
    } catch (error:any) {
        res.status(404).json({
            success:false,
            message:'dont get any comment',
            data:error.message
        })
    }
}
export const commentController={
    createComment,
    getCommentById,
    getCommentByauthor
}