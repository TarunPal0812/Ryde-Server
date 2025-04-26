import captain from "../models/captain.model.js";
import { validationResult } from "express-validator";
import { createCaptain } from "../services/captain.services.js";
import BlacklistToken from "../models/blacklistToken.model.js";

// Register controller

const registerCaptain = async(req,res,next)=>{
    try {
       
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }

        const {fullname,email,password,vehicle} = req.body

        const existingCaptain = await captain.findOne({ email })
if (existingCaptain) {
    return res.status(409).json({ message: "User with this email already exists" })
}
        
        const hashedPassword = await captain.hashPassword(password)

        const newCaptain = await createCaptain({firstname:fullname.firstname,
            lastname:fullname.lastname
            ,email,password:hashedPassword,
            color:vehicle.color,
            plate:vehicle.plate,    
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType

        })

        const token = await newCaptain.generateAuthToken()

        return res.status(200).json({token,newCaptain})

    } catch (error) {
        console.error("Error",error);
        
    }
}

// Login controller

const loginCaptain = async(req,res,next)=>{
    try {
       
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }

        const {email,password} = req.body

        const existingCaptain = await captain.findOne({ email }).select("+password")
        if (!existingCaptain) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        
        const isMatch = await existingCaptain.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = await existingCaptain.generateAuthToken()

        res.cookie("token",token)

        return res.status(200).json({token,existingCaptain})

    } catch (error) {
        console.error("Error",error);
        
    }
}

// Get Captain profile controller

const getCaptainProfile = async(req,res,next)=>{
    try {
        // console.log("req.user",req.user);
        
       res.status(200).json({captain:req.captain})    
    } catch (error) {
        console.error("Error",error);
    }
}

// Logout controller
const logoutCaptain = async(req,res,next)=>{
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
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
}
