import Joi from "joi";
import { productModel } from "./productModel.js";

export const addProduct = async ( req, res, ) => {
    try {

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(''),
            price: Joi.number().required(),
            availableStock: Joi.number().integer().min(0).required()
        });

        const { value, error } = schema.validate(req.body);
        if (error) {
            return res.send({ status: false, message: "validation Error...!"})
        }

        const newProduct = new productModel(value);
        const savedProduct = await newProduct.save()
            
        return res.send({ status: true, message: "Product saved Successfully", Data: savedProduct })

        
    } catch (error) {
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const updatedProduct = async ( req, res ) => {
    try {

        const id = req.params.id;
        const { name, price, availableStock, reservedStock } = req.body;

        const findProduct = await productModel.findById({ _id : id })
        if (!findProduct) {
            return res.send({ status: false, message: "Product Not Found...!" })
        }

        const product = await productModel.findByIdAndUpdate(
            { _id : id },
            { $set : {
                name : name,
                price : price,
                availableStock : availableStock,
                reservedStock : reservedStock,
            }},
            { new: true }
        )

        return res.send({ status: true, message: "Product update Successfully", Data: product })
        
    } catch (error) {
        console.log(".....error......",error)
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const deleteProduct = async ( req, res ) => {
    try {

        const id = req.params.id;

        const deleteProduct = await productModel.findByIdAndDelete({ _id : id })

        return res.send({ status: true, message: "Product deleted Successfully", })
        
    } catch (error) {
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const listProducts = async ( req, res ) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = ( page - 1 ) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        const name = req.query.name || '';

        const filter = name ? { name: { $regex: name, $options: 'i' } } : {};

        const products = await productModel.find(filter)
                .sort({ [sortBy]: order })
                .skip(skip)
                .limit(limit);

    const total = await productModel.countDocuments(filter);

    return res.send({ 
        status: true, 
        message: "Product deleted Successfully", 
        Data : products, 
        totalCount : total, 
        currentPage : page,
        totalPage : Math.ceil( total / limit )
    })

    } catch (error) {
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}