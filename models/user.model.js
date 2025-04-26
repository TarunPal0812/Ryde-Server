import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    fullname:{
       firstname:{
        type:String,
        required: true,
        minlength:[3,"First name must be at least 3 characters"]
       },
       lastname:{
        type:String,
        minlength:[3,"Last name must be at least 3 characters"]
       }
       
    },
    email:{
      type:String,
        required: true,
        unique:true,
        minlength:[5,"Email must be at least 5 characters"],
        match: [/.+@.+\..+/, "Please enter a valid email address"],
        lowercase: true,
        trim: true


    },
    password:{
       type:String, 
       required: true,
       select: false
    },
    socketId:{
       type:String,  
    }
},{
    timestamps: true
})

userSchema.methods.generateAuthToken = async function (){
   const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn
    : "24h"
   }) 
   return token
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10)
}

const user = mongoose.model("user",userSchema)
export default user