import mongoose from "mongoose";
import { DevServer } from "./config.js";
import { logger } from "./logger.js";

const mongoUrl = DevServer.url;

mongoose.connect(mongoUrl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => {
    logger.info('Database Connection Successfully!');
    })
    .catch((error) => {
        logger.error(`Database not connected ${error.message}`);
    });