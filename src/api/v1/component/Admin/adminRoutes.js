import express from "express";
const router = express.Router();

import { listAllOrders, updateStatus } from "./adminController.js";
import { adminAuth } from "../../../../middlewares/adminAuthMiddleware.js";

router.use(adminAuth('ADMIN'));

router.get("/listAllOrders", async ( req, res, next ) => {
    listAllOrders(req, res, next );
});

router.patch("/updateStatus/:id/", async ( req, res, next ) => {
    updateStatus(req, res, next );
});



export default router;