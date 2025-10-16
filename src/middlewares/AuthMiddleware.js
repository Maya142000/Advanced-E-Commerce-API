import jwt from "jsonwebtoken";
import { userModel } from "../api/v1/component/User/userModel.js";

// const auth = (requiredRole) => {
//     return async (req, res, next) => {
//         try {

//             const token = req.headers.authorization?.split(" ")[1];
//             if (!token) {
//                 return res.send({ status : false, message : "Access denied. Please provide token...!" });
//             }
        
//             const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
//             const user = await userModel.findById(decoded._id).select("-password");
//             if (!user) {
//                 return res.send({ status : false, message : "Invalid token or user not found." });
//             }
        
//             if (requiredRole && user.role !== requiredRole) {
//                 return res.send({ status : false, message : "Only Access to Admin" });
//             }
        
//             req.user = user;

//             next();

//         } catch (error) {
//             res.status(401).json({ status : false, message : "Unauthorized", error : error.message });
//         }
//     };
// };

// export default auth;

// Admin Authentication
export const adminAuth = (requiredRole = "ADMIN") => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.send({ status: false, message: "Access denied. Please provide token...!" });
            }
        
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await userModel.findById(decoded._id).select("-password");
        
            if (!user) {
                return res.send({ status: false, message: "Invalid token or user not found." });
            }
        
            if (requiredRole && user.role !== requiredRole) {
                return res.send({ status: false, message: "Only Access to Admin" });
            }
        
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ status: false, message: "Unauthorized", error: error.message });
        }
    };
};


// User Authentication
export const userAuth = (requiredRole = "USER") => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.send({ status: false, message: "Access denied. Please provide token...!" });
            }
        
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await userModel.findById(decoded._id).select("-password");
        
            if (!user) {
                return res.send({ status: false, message: "Invalid token or user not found." });
            }
        
            if (requiredRole && user.role !== requiredRole) {
                return res.send({ status: false, message: "Only Access to Users" });
            }
        
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ status: false, message: "Unauthorized", error: error.message });
        }
    };
};


