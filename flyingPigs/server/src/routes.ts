import * as express from "express";
import {airportFinder} from "./findAirports";
export const mongoRouter = express.Router();
import {flightsApi} from "./flightsApi";
mongoRouter.use(express.json());
var Airport = require("./airport");
import log4js from "log4js";
var logger = log4js.getLogger();

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
        // console.log("search routes");
        let searchParams = req.body;
        // console.log(searchParams);
        //use searchParams.departCoord to prefilter get list of prefilter airports.
        //pass list of prefilter airports and searchParams.departCoord to findAirports
        //for each airport the findAirports returns, call flight api with search params.
        //combine all lists and pass to res.

        let flightsList:any[][] = [];

        //logger.info(searchParams);
        let myDepFinder = new airportFinder();
        let depPrefilter = await myDepFinder.findAirportsInRange(searchParams.departCoord.lat, searchParams.departCoord.lng, searchParams.maxTimeStart.sec, searchParams.selectedDTransport.code);        
        let depAirportArray = await myDepFinder.findAirports(searchParams.departCoord.lat, searchParams.departCoord.lng, depPrefilter, searchParams.maxTimeStart.sec, searchParams.selectedDTransport.code);
        let myArrFinder = new airportFinder();
        // console.log(searchParams.arriveCoord.lat);
        // console.log(searchParams.arriveCoord.lng);
        // console.log(searchParams.maxTimeEnd.sec);
        // console.log(searchParams.selectedTransport.code);
        // let arrPrefilter = await myArrFinder.findAirportsInRange(searchParams.departCoord.lat, searchParams.departCoord.lng, searchParams.maxTimeStart.sec, searchParams.selectedTransport.code);
        let arrPrefilter = await myArrFinder.findAirportsInRange(searchParams.arriveCoord.lat, searchParams.arriveCoord.lng, searchParams.maxTimeEnd.sec, searchParams.selectedATransport.code);        
        // let arrAirportArray = await myArrFinder.findAirport(searchParams.departCoord.lat, searchParams.departCoord.lng, arrPrefilter, searchParams.maxTimeStart.sec, searchParams.selectedTransport.code);
        let arrAirportArray = await myArrFinder.findAirports(searchParams.arriveCoord.lat, searchParams.arriveCoord.lng, arrPrefilter, searchParams.maxTimeEnd.sec, searchParams.selectedATransport.code);
        // console.log(arrAirportArray);

        for(let i = 0; i < depAirportArray.length; i++) {
            for(let j = 0; j < arrAirportArray.length; j++) {
                let myFlightApi = new flightsApi(depAirportArray[i].IATA, arrAirportArray[j].IATA, searchParams.departDate, searchParams.returnDate, searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass.code, !searchParams.isRoundTrip);
                let flights = await myFlightApi.queryApi()
                let flightsThree = flights.slice(0,3);
                flightsThree.forEach(element => flightsList.push(element));
            }
        }



        // let myFlightApi = new flightsApi(depAirportArray[6].IATA, arrAirportArray[0].IATA, searchParams.departDate, searchParams.returnDate, searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass.code, !searchParams.isRoundTrip);

        // let myFlightApi = new flightsApi("ORD", "IND",
        //     "2022-10-21", "2022-10-23", 1, 0, 0, "Economy", true);
        // let flightsTen = await myFlightApi.queryApi()
        // console.log(flightsTen.slice(0,10));
        // res.status(200).send(flightsTen.slice(0,10));
        console.log(flightsList);
        res.status(200).send(flightsList);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

mongoRouter.post("/log", async (req, res) => {
    let level = req.body.level;
    let msg = req.body.message;
    let filename = req.body.fileName;
    let lineNumber = req.body.lineNumber;
    let columnNumber = req.body.columnNumber;
    //add switch case for different levels (debug, error, trace, etc)
    logger.info("clientside file " + filename + " " + msg + " line " + lineNumber + " col " + columnNumber);
})