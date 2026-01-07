import app from "./app"
import { prisma } from "./lib/prisma"
const port=process.env.PORT || 5000
async function server(){
    try {
        await prisma.$connect()
        console.log('server is connected to the database')
        app.listen(port,()=>{
            console.log(`server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
        await prisma.$disconnect()
        process.exit(1)
    }
}
server()