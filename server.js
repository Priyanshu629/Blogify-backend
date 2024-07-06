import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { dbConnect } from "./utils/db.config.js"
import userRouter from "./routes/user.route.js"
import blogRouter from "./routes/blog.route.js"
import { isAuthenticated } from "./middleware/auth.middleware.js"

const app = express()
const PORT = process.env.PORT || 3000
dbConnect()


app.use(cors({
    origin: ["http://localhost:5173","https://my-blogify-app.netlify.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get("/api/v1/check",isAuthenticated,(req,res)=>{
   
  return res.status(200).json({userId:req.user.userId})
})
app.use('/api/v1/user',userRouter)
app.use('/api/v1/blog',blogRouter)


app.listen(PORT,()=>console.log(`listening at port ${PORT}`))