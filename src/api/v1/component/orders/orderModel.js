import mongoose,{ Schema } from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    priceAtPurchase: { 
        type: Number, 
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    items: [
        orderItemSchema
    ],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['PENDING_PAYMENT','PAID','SHIPPED','DELIVERED','CANCELLED'], 
        default: 'PENDING_PAYMENT' 
    },
    paymentId: { 
        type: String 
    }
}, { timestamps: true });

export const orderModel = mongoose.model( "orders", orderSchema );


const paymentSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    transactionId: String,
    amount: Number,
    status: { 
        type: String, 
        enum: ['SUCCESS','FAILED'] 
    }
}, { timestamps: true });

export const paymentModel =  mongoose.model("Payment", paymentSchema);