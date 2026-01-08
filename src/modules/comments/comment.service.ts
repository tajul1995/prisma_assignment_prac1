import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

type Comment={
     content:string,
     postId :string,
     authorId : string,
      parentId?:string
 }
const createComment= async(data:Comment)=>{
    const postData = await prisma.post.findUniqueOrThrow({
        where:{
            id:data.postId
        }
    })
    if(data.parentId){
        const parentData= await prisma.comment.findUniqueOrThrow({
            where:{
                id:data.parentId
            }
        })
    }
    const result= await  prisma.comment.create({
        data
    })
    return result
}

const getCommentById=async(commentId:string)=>{
    return await prisma.comment.findUnique({
        where:{
            id:commentId
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    content:true
                }
            }
        }
    })
}

const getCommentByauthor=async(Id:string)=>{
    const count=await prisma.comment.count({
        where:{
            authorId:Id
        }
    })
    const result= await prisma.comment.findMany({
        where:{
            authorId:Id
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    views:true
                }
            },
            
        },
        
    })
    return {
        data:result,
        total:count
    }
}

const deleteCommentById=async(commentId:string,authorId:string)=>{
    const findComment=await prisma.comment.findFirst({
        where:{
            id:commentId,
            authorId
        }
    })
    if(!findComment){
        throw new Error("invalied aithorid")
    }
    return await prisma.comment.delete({
        where:{
            id:commentId
        }
    })
}

const updateComment=async(commentId:string,data:{content?:string,status?:CommentStatus},authorId:string)=>{
 const findComment=await prisma.comment.findFirst({
        where:{
            id:commentId,
            authorId
        }
    })
    if(!findComment){
        throw new Error("invalied aithorid")
    }


return await prisma.comment.update({
    where:{
        id:commentId
    },
    data
})





}

const moderateCommentStatus=async(id:string,data:{status:CommentStatus})=>{
        const findComment=await prisma.comment.findUniqueOrThrow({
            where:{
                id
            }
        })
        if(findComment.status === data.status){
            throw new Error(`your provided status ${data.status} already upto date`)
        }
        return await prisma.comment.update({
            where:{
                id:findComment.id
            },
            data
        })
}
    
export const  commentService={
    createComment,
    getCommentById,
    getCommentByauthor,
    deleteCommentById,
    updateComment,
    moderateCommentStatus
}