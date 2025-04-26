import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema({ 
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters"]
        },
        lastname: {
            type: String,
            minlength: [3, "Last name must be at least 3 characters"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters"],
        match: [/.+@.+\..+/, "Please enter a valid email address"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    vehicle: {
        color: {
            type: String,
            required: true
        },
        plate: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        vehicleType: {
            type: String,
            enum: ["car", "motorcycle", "auto"],
            required: true
        },
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    },
 },{
    timestamps: true
})

captainSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
    return token
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

const captain = mongoose.model("captain", captainSchema)
export default captain