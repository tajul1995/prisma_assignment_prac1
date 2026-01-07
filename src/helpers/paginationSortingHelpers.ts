
 type IOptions={
    pages?:number|string,
    limit?:number|string,
    sortBy?:string,
    sortOrder?:string
 }
 type IReturn={
    pages:number,
    limit:number,
    skip:number,
    sortBy:string,
    sortOrder:string
 }
const paginationSortingHelpers=(options:IOptions):IReturn=>{
    const pages:number=Number(options.pages) ||1
    const limit:number=Number(options.limit) ||10
    const skip:number=(pages-1)*limit
    const sortBy:string=options.sortBy ||"createdAt"
    const sortOrder:string=options.sortOrder||"desc"
    return {
        pages,
        limit,
        skip,
        sortBy,
        sortOrder
    }


}
export default paginationSortingHelpers