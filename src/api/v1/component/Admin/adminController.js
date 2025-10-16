import Joi from "joi";
import { orderModel } from "../orders/orderModel.js";

export const listAllOrders = async (req, res) => {
    try {
        const { status } = req.query;

        const page = parseInt(req.query.page) ||  1;
        const limit = parseInt(req.query.limit) ||  10;
        const skip = ( page - 1 ) * limit;

        const query = {};

        if (status) query.status = status;

        const [getALlOrders, totalOrders] = await Promise.all([
            orderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            orderModel.countDocuments(query)
        ]);

        return res.send({ 
            status: true, 
            message: "Orders fetched Successfully", 
            Data: getALlOrders,
            totalCount : totalOrders,
            currentPage : page,
            totalPage : Math.ceil(totalOrders / limit )
        })

    } catch (error) {
        console.log("...error...", error);
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
};


export const updateStatus = async (req, res) => {
    try {
        const schema = Joi.object({
            status: Joi.string()
                .valid('PENDING_PAYMENT','PAID','SHIPPED','DELIVERED','CANCELLED')
                .required()
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.send({ status: false, message: "Validation error...!" });
        }

        const orderId = req.params.id;
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status: value.status },
            { new: true }
        );

        if (!order) {
            return res.send({ status: false, message: "Order not found" });
        }

        return res.send({
            status: true,
            message: `Order status updated to ${value.status}`,
            Data: order
        });

    } catch (error) {
        console.log("...error...", error);
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
};

