import express from "express"

const router = express.Router()
import { body } from "express-validator"
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain } from "../controllers/captain.controller.js"
import { authCaptain } from "../middleware/auth.middleware.js"


router.post('/register',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body('vehicle.color').isLength({min:3}).withMessage("Vehicle color must be at least 3 characters long"),
    body('vehicle.plate').isLength({min:3}).withMessage("Vehicle plate must be at least 3 characters long"),        
    body('vehicle.capacity').isNumeric().withMessage("Vehicle capacity must be a number"),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage("Vehicle type must be either car, motorcycle or auto"),
    
],registerCaptain)

router.post('/login',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long"),
],loginCaptain)

router.post('/profile',authCaptain,getCaptainProfile)

router.get('/logout',authCaptain,logoutCaptain)

export default router