import Joi from "joi";
import { cartModel } from "./cartModel.js";
import { productModel } from "../product/productModel.js";

export const addItem = async ( req, res ) => {
    console.log("...vvvv....",req.body)
    try {

        const schema = Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required()
        });

        const { value, error } = schema.validate(req.body);
        if (error) {
            return res.send({ status: false, message: "validation Error...!", error: error.message });
        }

        const findProduct = await productModel.findById( value.productId );
        if (!findProduct) {
            return res.send({ status: false, message: "Product Not Found..!" });
        }

        let cart = await cartModel.findOne({ userId : req.user._id });
        if (!cart) {
            cart = await cartModel.create({ 
                userId: req.user._id, 
                items: [{ 
                    productId: value.productId, 
                    quantity: value.quantity 
                }] 
            })
        } else {
            const existingItem = cart.items.find(i => i.productId.toString() === value.productId);

            if (existingItem) {
                existingItem.quantity = value.quantity;
            } else {
                cart.items.push({
                    productId: value.productId,
                    quantity: value.quantity
                });
            }
        }

        await cart.save();

        return res.send({ status: true, message: "Item In Cart SItem added to cart successfully", Data: cart });

        
    } catch (error) {
        console.log("....error...",error)
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}

export const getCart = async ( req, res ) => {
    try {

        const cart = await cartModel.findOne({ userId: req.user._id })
                    .populate('items.productId');
        if (!cart) {
            return res.send({ status: false, message: "Product Not Found..!" });
        }

        return res.send({ status : true, message: "Carts Get Successfully", Data : cart });
        
    } catch (error) {
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const removeItem = async ( req, res ) => {
    try {
        
        const productId = req.params.productId;

        const cart = await cartModel.findOne({ userId: req.user._id });
        if (!cart) {
            return res.send({ status: false, message: "cart Not Found..!" });
        }

        cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        await cart.save();

        return res.send({ status : true, message: "Carts remove Successfully", Data : cart });

    } catch (error) {
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}