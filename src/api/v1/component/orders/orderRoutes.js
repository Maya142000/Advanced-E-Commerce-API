import express from "express";
const router = express.Router();

import { checkout, payOrder, getAllOrders, getOrderById } from "./orderController.js";
import { userAuth } from "../../../../middlewares/AuthMiddleware.js";

router.use(userAuth('USER'));

router.post("/checkout", async ( req, res, next ) => {
    checkout(req, res, next );
});

router.post("/payOrder/pay/:id/", async ( req, res, next ) => {
    payOrder(req, res, next );
});

router.get("/getAllOrders", async ( req, res, next ) => {
    getAllOrders(req, res, next );
});

router.get("/getOrderById/:id", async ( req, res, next ) => {
    getOrderById(req, res, next );
});

export default router;