
import user from "../models/user.model.js";

export const createUser = async ({firstname,lastname,email,password})=>{
    if (!firstname || !lastname || !email || !password) {
        throw new Error("All firlda are required")
    }
    const User = await user.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    })

    return User
}