import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { mongoRouter } from "./routes"
import log4js from "log4js";
dotenv.config();

var day:Date = new Date();
var logString = '../logs/log-' + (day.getMonth()+1) + '-' + day.getDate() + '.log';
const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        log4js.configure({
            appenders: {
                file: { type: 'file', filename: logString, layout: {type:"pattern", pattern: "[%f{1} %d line %l]: %m"} }
            },
            categories: {
                default: { appenders: ['file'], level: 'debug', enableCallStack: true }
            }
        });
        let logger = log4js.getLogger();
        const app = express();
        app.use(cors());

        app.use("/airports", mongoRouter);
        // start the Express server
        app.listen(5200, () => {
            console.log(`Server running at http://localhost:5200...`);
            logger.info("Server started running...");
        });

    })
    .catch(error => console.error(error));