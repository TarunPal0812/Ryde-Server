import user from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.model.js";
import captain from "../models/captain.model.js";

//Authentication middleware to check if the user is authenticated
const authUser = async (req, res, next) => {  
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
   if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const loginUser = await user.findById(decoded._id)

    // console.log("loginUser",loginUser);
    

    req.user = loginUser;



    return next();

  } catch (error) {
    console.error("Error in authUser middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
    
  }
 }

//Auth captain middleware

 const authCaptain = async (req, res, next) => {  
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
   if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const loginCapain = await captain.findById(decoded._id)

    // console.log("loginUser",loginUser);
    

    req.captain = loginCapain;



    return next();

  } catch (error) {
    console.error("Error in authUser middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
    
  }
 }


  export{
    authUser,
    authCaptain
  }
