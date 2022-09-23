import * as express from "express";
import * as mongodb from "mongodb";
import {collections} from "./database";
import {Airport} from "./airport";
import {AirportSchema} from "./airportSchema";

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

mongoRouter.get("/filtered", async (_req, res) => {
    try {
        let airportArr:AirportSchema[] = [];
        const query = {_id: new mongodb.ObjectId("632861ffd3147f9597bead9d")};
        const airport = await collections.airports.findOne(query);
        // const airportSend1 = new Airport("1600 Messer", "yas", "queen", "you",
        //     "are", "a", 55, "amongst", "men", 42, 55);
        // const airportSend2 = new Airport("5900 Messer", "yas", "queen", "you",
        //     "are", "a", 55, "amongst", "men", 42, 55);
        // airportArr.push(airportSend1);
        // airportArr.push(airportSend2);
        airportArr.push(airport);
        console.log(airportArr);
        res.status(200).send(airportArr);
    } catch (error) {
        res.status(500).send(error.message);
    }
})