import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "./userModel.js";

export const register = async ( req, res ) => {
    try {

        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid('USER', 'ADMIN').optional() 
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.send({ status: false, message: "validation Error...!", error: error.message })
        }

        const existingUser = await userModel.findOne({ email: value.email  });
        if (existingUser) { 
            return res.send({ status: false, message: "User Already Exist...!" });
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);
        const user = await userModel.create({ ...value, password: hashedPassword });

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });

        return  res.send({ status: true, message: "user Created Successfully", Data : user, token: token });
        
    } catch (error) {
        // console.log(".....error......",error)
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}


export const login = async ( req, res ) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.send({ status: false, message: "validation Error...!", error: error.message })
        }

        const existingUser = await userModel.findOne({ email: value.email  });
        if (!existingUser) { 
            return res.send({ status: false, message: "Oops..!, Wrong Email or Password." });
        }

        const PasswordMatch = await bcrypt.compare( value.password, existingUser.password );
        if (!PasswordMatch) { 
            return res.send({ status: false, message: "Oops..!, Wrong Email or Password." });
        }

        const token = jwt.sign({ _id: existingUser._id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });

        return  res.send({ status: true, message: "Welcome..!, You've logged in successfully.", Data : existingUser, token: token })

    } catch (error) {
        // console.log("....error......",error)
        return res.send({ status: false, message: "Internal Server error...!", error: error.message });
    }
}