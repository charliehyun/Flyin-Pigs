import * as express from "express";
import * as mongodb from "mongodb";
import {airportFinder} from "./findAirports";
import mongoose from "mongoose";
export const mongoRouter = express.Router();
import {flightsApi} from "./flightsApi";
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



mongoRouter.post("/search", async (req, res) => {
    try {
        let searchParams = req.body;
        //use searchParams.departCoord to prefilter get list of prefilter airports.
        //pass list of prefilter airports and searchParams.departCoord to findAirports
        //for each airport the findAirports returns, call flight api with search params.
        //combine all lists and pass to res.

        let flightsList:any[][] = [[]];

        let myDepFinder = new airportFinder();
        let depPrefilter = await myDepFinder.findAirportsInRange(searchParams.departCoord.lat(), searchParams.departCoord.lng(), searchParams.maxTimeStart, searchParams.selectedTransport);        
        let depAirportArray = await myDepFinder.findAirport(searchParams.departCoord.lat(), searchParams.departCoord.lng(), depPrefilter, searchParams.maxTimeStart, searchParams.selectedTransport);

        let myArrFinder = new airportFinder();
        let arrPrefilter = await myArrFinder.findAirportsInRange(searchParams.arrivalCoord.lat(), searchParams.arrivalCoord.lng(), searchParams.maxTimeEnd, searchParams.selectedTransport);        
        let arrAirportArray = await myArrFinder.findAirport(searchParams.arrivalCoord.lat(), searchParams.arrivalCoord.lng(), arrPrefilter, searchParams.maxTimeEnd, searchParams.selectedTransport);

        // for(let i = 0; i < depAirportArray.length; i++) {
        //     for(let j = 0; j < arrAirportArray.length; j++) {
        //         let myFlightApi = new flightsApi(depAirportArray[i], arrAirportArray[j],searchParams.departDate, searchParams.returnDate, searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass, !searchParams.isRoundTrip);
        //     }
        // }

        console.log(depAirportArray);
        console.log(arrAirportArray);
        let myFlightApi = new flightsApi(depAirportArray[0], arrAirportArray[0],searchParams.departDate, searchParams.returnDate, searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass, !searchParams.isRoundTrip);

        // let myFlightApi = new flightsApi("ORD", "IND",
        //     "2022-10-21", "2022-10-23", 1, 0, 0, "Economy", true);
        let flightsTen = await myFlightApi.queryApi()
        console.log(flightsTen.slice(0,10));
        res.status(200).send(flightsTen.slice(0,10));
    } catch (error) {
        res.status(500).send(error.message);
    }
})

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
        let myFlightApi = new flightsApi("GST", "GUM",
            "2022-10-21", "2022-10-23", 1, 0, 0, "Economy", true);

        let myJson = await myFlightApi.queryApi();
        console.log(myJson);
        //do whatever with my json, or just do it all in `flightsApi.ts`
        res.status(200).send(airportArray);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})