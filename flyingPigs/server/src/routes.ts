import * as express from "express";
import * as mongodb from "mongodb";
import {collections} from "./database";

import {AirportSchema} from "./airportSchema";
import mongoose from "mongoose";
const AirportModel = require('./airport');
export const mongoRouter = express.Router();
mongoRouter.use(express.json());


mongoRouter.get("/", async (_req, res) => {
    try {
        //const airports = await collections.airports.find({}).toArray();
        //res.status(200).send(airports);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

mongoRouter.get("/filtered", async (_req, res) => {
    try {
        var airportArr:any = [];
        //let testId = "632861ffd3147f9597bead9d";
        const query = {_id: new mongodb.ObjectId("632861ffd3147f9597bead9d")};
        //const airport = await collections.airports.findOne(query);
        var airports = mongoose.model('Airport');
        airports.findOne(query, function(err:any, data:any) {
            if (err) {console.log(err);}
            else {console.log(data);
                airportArr.push(data);}
        });
        const newAirport = new AirportModel({
            Address:"3331 My Street",
            Airport:"Suck Airport",
            Country:"United States",
            Enplanement:"40000000",
            FAA:"ORD",
            IATA:"ORD",
            ICAO:"ORD",
            LAT:-41.34,
            LNG:40.52,
            Role:"Private",
            State:"Indiana",
            City:"Lafayette"
        })

        airportArr.push(newAirport);
        res.status(200).send(airportArr);
    } catch (error) {
        res.status(500).send(error.message);
    }
})