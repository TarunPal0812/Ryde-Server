import dotenv from "dotenv"
dotenv.config()
import cors from "cors"

import userRoutes from "./routes/user.routes.js"
import captainRoutes from "./routes/captain.routes.js"

import cookieParser from "cookie-parser"
import express from "express"
const app = express()

app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"]
    }
))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("Hello...!")
})

//User routes
app.use("/api/v1/user",userRoutes)

//Captain routes
app.use("/api/v1/captain",captainRoutes)




export default app