import * as express from "express";
import * as mongodb from "mongodb";
import {airportFinder} from "./findAirports";
import mongoose from "mongoose";
export const mongoRouter = express.Router();
mongoRouter.use(express.json());
var Airport = require("./airport");

mongoRouter.get("/", async (_req, res) => {
    try {
        //let airportsCollection = mongoose.model('Airport');
        const airports = await Airport.find({});
        res.status(200).send(airports);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

mongoRouter.get("/filtered", async (_req, res) => {
    try {
        var airportArr:any = [];
        const query = {_id: new mongodb.ObjectId("6331d616a1b5b7d69fe724e3")};
        const query2 = {_id: new mongodb.ObjectId("6331d616a1b5b7d69fe724e5")};
        //const airport = await collections.airports.findOne(query);
        const airport = await Airport.findOne(query);
        const airport2 = await Airport.findOne(query2);
        let startLat = 40.43; //this be the start lat / lng for my apartment
        let startLng = -86.91;
        let drivetime = 4;
        let travelMethod = 'DRIVE';
        airportArr.push(airport);
        airportArr.push(airport2);
        //console.log(airportArr);
        let myFinder = new airportFinder();
        //console.log(myFinder);
        let airportArray = myFinder.findAirport(startLat, startLng, airportArr, drivetime, travelMethod);
        console.log(airportArray);
        res.status(200).send(airportArr);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})