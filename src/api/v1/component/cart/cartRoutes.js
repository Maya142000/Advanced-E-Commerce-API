import express from "express";
const router = express.Router();

import { addItem, getCart, removeItem } from "./cartController.js";
import { userAuth } from "../../../../middlewares/AuthMiddleware.js";

router.use(userAuth('USER'));

router.post("/addItem", async ( req, res, next ) => {
    addItem(req, res, next );
});

router.get("/getCart", async ( req, res, next ) => {
    getCart(req, res, next );
});

router.delete("/removeItem/:productId", async ( req, res, next ) => {
    removeItem(req, res, next );
});

export default router;