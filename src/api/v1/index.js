import express from 'express';
const apirouter = express.Router();

import userRoutes from "./component/User/userRoutes.js";
apirouter.use("/users", userRoutes );

import productRoutes from "./component/product/productRoutes.js";
apirouter.use( "/products", productRoutes );

import cartRoutes from "./component/cart/cartRoutes.js";
apirouter.use("/carts", cartRoutes)

import orderRoutes from "./component/orders/orderRoutes.js";
apirouter.use("/orders", orderRoutes );

import adminRoutes from "./component/Admin/adminRoutes.js";
apirouter.use("/admin", adminRoutes );

export default apirouter;