import mongoose,{ Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        index: true,
        description: String,
    },
    price : {
        type : Number,
        required : true,
        default : 0
    },
    availableStock : {
        type : Number,
        required : true,
        default : 0
    },
    reservedStock : {
        type : Number,
        required : true,
        default : 0
    }
}, {timestamps : true })

export const productModel = mongoose.model( "products", productSchema );