import express from "express"
import { postRouter } from "./modules/post/post.router"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'
import { commentRouter } from "./modules/comments/comment.router";
import { notFound } from "./middleWare/notFound";
import errorHandler from "./middleWare/globalErrorHandler";
const app=express()
app.use(cors({
    origin:process.env.APP_URL || "http://localhost:3000",
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))


app.all("/api/auth/*splat", toNodeHandler(auth));
// MIDDLEWARE
app.use(express.json())



app.use('/posts',postRouter)
app.use('/comments',commentRouter)
app.use(notFound)
app.use(errorHandler)


export default app