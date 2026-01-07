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
export const  commentService={
    createComment,
    getCommentById,
    getCommentByauthor
}