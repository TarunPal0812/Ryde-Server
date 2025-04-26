import user from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.model.js";
import { createUser } from "../services/user.services.js";
import { validationResult } from "express-validator";

const registerUser = async(req,res,next)=>{
    try {
       
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }

        const {fullname,email,password} = req.body

        const existingUser = await user.findOne({ email })
if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" })
}
        
        const hashedPassword = await user.hashPassword(password)

        const User = await createUser({firstname:fullname.firstname,
            lastname:fullname.lastname
            ,email,password:hashedPassword
        })

        const token = await User.generateAuthToken()

        return res.status(200).json({token,User})

    } catch (error) {
        console.error("Error",error);
        
    }
}

// Login controller

const loginUser = async(req,res,next)=>{
    try {
       
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }

        const {email,password} = req.body

        const existingUser = await user.findOne({ email }).select("+password")
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        
        const isMatch = await existingUser.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = await existingUser.generateAuthToken()

        res.cookie("token",token)

        return res.status(200).json({token,existingUser})

    } catch (error) {
        console.error("Error",error);
        
    }
}

// Get user profile controller

const getUserProfile = async(req,res,next)=>{
    try {
        // console.log("req.user",req.user);
        
       res.status(200).json({user:req.user})    
    } catch (error) {
        console.error("Error",error);
    }
}

// Logout controller
const logoutUser = async(req,res,next)=>{
    try {
        res.clearCookie("token")

        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        await BlacklistToken.create({token})

        return res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        console.error("Error",error);
    }
}


export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
}