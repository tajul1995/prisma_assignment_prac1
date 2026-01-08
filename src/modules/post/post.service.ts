
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


 const updateUserOwnPost= async(id:string,data:Partial<Post>,authorId:string,isAdmin:boolean)=>{
 await prisma.post.findUniqueOrThrow({
        where:{
            id,
            authorId
            
        }
        
    })
    if(!isAdmin){
        delete data.isFeatured
        
    }
    const result= await prisma.post.update({
        where:{
            id
        },
        data
    })
    return result
 }
export  const postService={
    createPost,
    findAllPost,
    findPostById,
    getMyPosts,
    updateUserOwnPost

}