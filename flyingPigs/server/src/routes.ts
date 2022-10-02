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


mongoRouter.get("/preFilter", async (req, res) => {
    try {
        console.log("preFilter");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

mongoRouter.get("/filtered", async (_req, res) => {
    try {
        var airportArr:any = [];
        const airports = await Airport.find({});
        for (let i = 0; i < 10; i++)
        {
            airportArr.push(airports[i]);
        }
        let startLat = 40.43; //this be the start lat / lng for my apartment
        let startLng = -86.91;
        let drivetime = 50;
        let travelMethod = 'driving';
        let myFinder = new airportFinder();
        let airportArray = await myFinder.findAirport(startLat, startLng, airportArr, drivetime, travelMethod);
        //console.log(airportArray);
        res.status(200).send(airportArray);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})