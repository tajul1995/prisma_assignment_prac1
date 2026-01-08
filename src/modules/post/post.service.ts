
import { count } from "node:console"
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client"
import { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"


const createPost= async(data:Omit<Post,"id"|"createdAt"|"updatedAt"|"authorId">,user:string)=>{
    const result= await prisma.post.create({
        data:{
            ...data,
            authorId:user
        }
    })
    return result
}
const findAllPost= async(search:string,allTags:string[]|[],isFeatured:boolean,status:PostStatus,authorId :string|undefined,pages:number, limit:number,skip:number,sortBy:string,sortOrder:string)=>{
    try {

        const andCondition:PostWhereInput[]=[]
        if(search){
            andCondition.push({OR:[
            {
                title:{
                contains:search,
                mode:'insensitive'
            }
            },
            {
                content:{
                contains:search,
                mode:'insensitive'
            }
            },{
                tags:{
                has:search
            }
            }


            ]})
        }
        if(allTags.length>0){
            andCondition.push({ tags:{
                hasEvery:allTags
            }})
        }
        if(typeof isFeatured === 'boolean'){
        andCondition.push({isFeatured})
    }

    if(authorId){
        andCondition.push({authorId})
    }

    if(status){
        andCondition.push({status})
    }
        const result= await prisma.post.findMany({
            take:limit,
            skip,
        where:{
            AND:andCondition
        },
        orderBy:
            {
                [sortBy]:sortOrder
            },
            include:{
                _count:{
                    select:{
                        comments:true
                    }
                }
            }
        
    })
    
    const count= await prisma.post.count({
        where:{
            AND:andCondition
        }
    })
    return {
        data:result,
        pagination:{
            total:count,
            pages,
            totalPages:Math.ceil(count/limit)
        }

        
    }
    } catch (error) {
        throw new Error("data does not found")
    }

    
}

 const findPostById=async(id:string)=>{
    return await prisma.$transaction(async(tx)=>{
        await tx.post.update({
        where:{
            id
        },
        data:{
            views:{
                increment:1
            }
        }
    })
    const result= await tx.post.findUnique({
        where:{
            id
        },
        include:{
            comments:{
                where:{
                    parentId:null,
                    status:CommentStatus.APPROVED
                },
                orderBy:{
                    createdAt:"desc"
                },
                include:{
                    
                    replies:{
                        where:{
                           status:CommentStatus.APPROVED 
                        },
                        orderBy:{
                    createdAt:"asc"
                },
                        include:{
                            replies:{
                                where:{
                           status:CommentStatus.APPROVED 
                        },orderBy:{
                    createdAt:"asc"
                },
                                include:{
                                    replies:{
                                        where:{
                           status:CommentStatus.APPROVED 
                        },
                        orderBy:{
                    createdAt:"asc"
                },
                                    }
                                }
                            }
                        }
                    }
                }
            },
            _count:{
                select:{
                    comments:true
                }
            }

            
        }
    })
    return result
    })

    
 }
 const getMyPosts= async(authorId:string)=>{
     await prisma.user.findUniqueOrThrow({
        where:{
            id:authorId,
            status:"ACTIVE"
        }
    })
    
    const result= await prisma.post.findMany({
        where:{
            authorId
        },
        include:{
            _count:{
                select:{
                    comments:true
                }
            }
        }
    })
    const total = await prisma.post.count({
        where:{
            authorId
        }
    })
    // const total1=await prisma.post.aggregate({
    //     _count:{
    //         id:true
    //     },
    //     where:{
    //         authorId
    //     }
    // })
    return {
        result,
        totalposts:total
    }
 }


 const updateUserOwnPost= async(postId:string,data:Partial<Post>,authorId:string,isAdmin:boolean)=>{
 const postData= await prisma.post.findUniqueOrThrow({
        where:{
            id:postId,
            
            
        },
        select:{
            id:true,
            authorId:true
        }
        
    })
    if(!isAdmin&&(postData.authorId !== authorId)){
        throw new Error('you are not owner of this post')
    }
    if(!isAdmin){
        delete data.isFeatured
        
    }
    const result= await prisma.post.update({
        where:{
            id:postId
        },
        data
    })
    return result
 }

const deletePost = async(postId:string,authorId:string,isAdmin:boolean)=>{
     const postData= await prisma.post.findUniqueOrThrow({
        where:{
            id:postId,
            
            
        },
        select:{
            id:true,
            authorId:true
        }
        
    })
    if(!isAdmin&&(postData.authorId !== authorId)){
        throw new Error('you are not owner of this post')
}

    const result= await prisma.post.delete({
        where:{
            id:postId
        }
        
    })
    return result
}

const getStats=async()=>{
    return await prisma.$transaction(async(tx)=>{
        const[totalPost,publishedPost,draftPost,archivedPost,totalComments,approvedComments]= await Promise.all([
            await tx.post.count(),
            await tx.post.count({where:{status:PostStatus.PUBLISHED}}),
            await tx.post.count({where:{status:PostStatus.DRAFT}}),
            await tx.post.count({where:{status:PostStatus.ARCHIVED}}),
            await tx.comment.count(),
            await tx.comment.count({where:{status:CommentStatus.APPROVED}})
        ])
        return {
            totalPost,
            publishedPost,
            draftPost,
            archivedPost,
            totalComments,
            approvedComments

        }
    })
}
export  const postService={
    createPost,
    findAllPost,
    findPostById,
    getMyPosts,
    updateUserOwnPost,
    deletePost,
    getStats

}