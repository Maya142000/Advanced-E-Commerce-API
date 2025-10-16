import express from "express";
const router = express.Router();

import { addProduct, updatedProduct, deleteProduct, listProducts } from "./productController.js";
import { adminAuth } from "../../../../middlewares/AuthMiddleware.js";


router.post("/addProduct", adminAuth("ADMIN"), addProduct );

router.put("/updatedProduct/:id", adminAuth("ADMIN"), updatedProduct );

router.delete("/deleteProduct/:id", adminAuth("ADMIN"), deleteProduct );

router.get("/listProducts", listProducts );

export default router;