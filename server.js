import express from "express";
const app = express();
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan"
dotenv.config();
    
import { logger } from "./src/config/logger.js";
import "./src/config/connection.js"
import apiRouter from "./src/api/v1/index.js"

const server = http.createServer(app);

const Port = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }))
app.use(cookieParser());
app.use(morgan("dev"));

const corsOptions = {
    origin: ["http://localhost:4200"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// app.get("/", (req, res) => res.send("API is running..."));
app.get("/", async (req, res) => {
    return res.send("Welcome to the Transactionl Order Project")
})

app.use("/api/v1", apiRouter);

server.listen(Port, () => {
    logger.info(`Server is running on port ${Port}`);
});