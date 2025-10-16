import mongoose,{Schema} from "mongoose";

const itemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "products", 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },
    items: [
        itemSchema
    ]
}, { timestamps: true });

export const cartModel = mongoose.model( "Cart", cartSchema );