import mongoose from "mongoose";
import { cartModel } from "../cart/cartModel.js";
import { orderModel, paymentModel } from "./orderModel.js";
import { productModel } from "../product/productModel.js";
import { addJob } from "../../../../Utils/jobQueue.js";


export const checkout = async (req, res) => {
    try {
        let cart = await cartModel.findOne({ userId: req.user._id });
        if (!cart) {
        cart = await cartModel.create({ userId: req.user._id, items: [] });
        }

        if (cart.items.length === 0) {
            return res.send({ status: false, message: "Cart is empty...!" });
        }


        const orderItems = [];

        for (const item of cart.items) {
            const product = await productModel.findOneAndUpdate(
                { 
                    _id: item.productId, 
                    availableStock: { $gte: item.quantity }
                },
                { 
                    $inc: { 
                        availableStock: -item.quantity, 
                        reservedStock: item.quantity 
                    } 
                },
                { new: true }
            );

            if (!product) {
                return res.send({ status: false, message: `Insufficient stock for product ${item.productId}` });
            }

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });
        }

        const totalAmount = orderItems.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

        const order = await orderModel.create({
            userId: req.user._id,
            items: orderItems,
            totalAmount,
            status: "PENDING_PAYMENT"
        });

        await cartModel.findOneAndUpdate(
            { userId: req.user._id },
            { items: [] }
        );

        setTimeout(async () => {
            const freshOrder = await orderModel.findById(order._id);
            if (freshOrder && freshOrder.status === "PENDING_PAYMENT") {
                for (const item of freshOrder.items) {
                    const prod = await productModel.findById(item.productId);
                    if (prod) {
                        prod.reservedStock -= item.quantity;
                        prod.availableStock += item.quantity;
                        await prod.save();
                    }
                }
                freshOrder.status = "CANCELLED";
                await freshOrder.save();
            }
        }, 15 * 60 * 1000);

        return res.send({ status: true, message: "Order placed successfully and awaiting payment", Data: order });

    } catch (error) {
        console.log("...error..", error);
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
};


export const payOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.send({ status: false, message: "Order not found" });
        }
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.send({ status: false, message: "Please check your order, this not Yours" });
        }
        if (order.status !== 'PENDING_PAYMENT') {
            return res.send({ status: false, message: "Order is Pending" });
        }

        const payment = await paymentModel.create({
            orderId: order._id,
            transactionId: `tx_${Date.now()}`,
            amount: order.totalAmount,
            status: 'SUCCESS'
        });

        for (const item of order.items) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.send({ status: false, message: `Product not found: ${item.productId}` });
            }

            product.reservedStock -= item.quantity;
            await product.save();
        }

        order.status = 'PAID';
        order.paymentId = payment._id;
        await order.save();

        addJob({ type: 'send_order_confirmation', payload: { orderId: order._id, userId: req.user._id } });

        return res.send({ status: true, message: "Payment successful", Data: order });

    } catch (error) {
        console.log("...error...", error);
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
};


export const getAllOrders = async ( req, res ) => {
    try {

        const page = parseInt(req.query.page) ||  1;
        const limit = parseInt(req.query.limit) ||  10;
        const skip = ( page - 1 ) * limit;

        const getALlOrders = await orderModel.find({ userId: req.user._id })
                .sort({ createdAt : - 1 })
                .limit(limit)
                .skip(skip)

        const totalOrders = await orderModel.countDocuments({ userId: req.user._id })
        
        
        return res.send({ 
            status: true, 
            message: "Orders fetched Successfully", 
            Data: getALlOrders,
            totalCount : totalOrders,
            currentPage : page,
            totalPage : Math.ceil(totalOrders / limit )
        })
                
    } catch (error) {
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const getOrderById = async ( req, res ) => {
    try {

        const id = req.params.id;
        if (!id) {
            return res.send({ status: false, message: "Please Provide ID...!", });
        }

        const getOrders = await orderModel.findById({ _id : id });
        if (!getOrders) {
            return res.send({ status: false, message: "Order not Found...!" });
        } else {
            return res.send({ status: true, message: "Order Fetched Succefully...!", Data: getOrders });
        }
        
    } catch (error) {
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}