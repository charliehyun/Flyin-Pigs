import * as express from "express";
import * as mongodb from "mongodb";
import {collections} from "./database";

export const mongoRouter = express.Router();
mongoRouter.use(express.json());

mongoRouter.get("/", async (_req, res) => {
    try {
        const airports = await collections.airports.find({}).toArray();
        res.status(200).send(airports);
    } catch (error) {
        res.status(500).send(error.message);
    }
});