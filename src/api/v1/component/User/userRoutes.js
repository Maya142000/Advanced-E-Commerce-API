import express from "express";
const router = express.Router();

import { register, login } from "./userController.js";

router.post("/register", async ( req, res, next ) => {
    register(req, res, next );
});

router.post("/login", async ( req, res, next ) => {
    login(req, res, next );
});

export default router;