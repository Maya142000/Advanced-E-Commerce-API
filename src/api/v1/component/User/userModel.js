import mongoose,{ Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true, 
        lowercase : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String, 
        enum : ['USER','ADMIN'], 
        default : 'USER'
    }
}, {timestamps : true });

export const userModel = mongoose.model( "User", userSchema );