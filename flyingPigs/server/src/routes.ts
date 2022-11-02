import e, * as express from "express";
import {airportFinder} from "./findAirports";
export const mongoRouter = express.Router();
import {flightsApi} from "./flightsApi";
mongoRouter.use(express.json());
var Airport = require("./airport");
import log4js from "log4js";
import { TravelMode } from "@googlemaps/google-maps-services-js";
import { Trip, ResultInfo, sortTrips } from "./flight";
import { ObjectId } from "mongodb";
var logger = log4js.getLogger();
var Credentials = require("./credentials");
const bcrypt = require('bcrypt');

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

        let tripList: Trip[] = [];
        let resultInfo: ResultInfo = {
            airlines: [],
            depAirlines: [],
            arrAirlines: [],
            minPrice: 0,
            maxPrice: 0,
            trips: [],
        };

        let stackedAirlines: string[][] = [];

        let myDepFinder = new airportFinder();
        let depPrefilter = await myDepFinder.findAirportsInRange(searchParams.departCoord.lat, searchParams.departCoord.lng, searchParams.maxTimeStart.sec, searchParams.selectedDTransport.code);        
        let depAirportArray = await myDepFinder.findAirports(searchParams.departCoord.lat, searchParams.departCoord.lng, depPrefilter, searchParams.maxTimeStart.sec, searchParams.selectedDTransport.code);
        let myArrFinder = new airportFinder();
        let arrPrefilter = await myArrFinder.findAirportsInRange(searchParams.arriveCoord.lat, searchParams.arriveCoord.lng, searchParams.maxTimeEnd.sec, searchParams.selectedATransport.code);        
        let arrAirportArray = await myArrFinder.findAirports(searchParams.arriveCoord.lat, searchParams.arriveCoord.lng, arrPrefilter, searchParams.maxTimeEnd.sec, searchParams.selectedATransport.code);

        let trips = [];
        for(let i = 0; i < depAirportArray.length; i++) {
            resultInfo.depAirlines.push(depAirportArray[i].IATA);
            for(let j = 0; j < arrAirportArray.length; j++) {
                resultInfo.arrAirlines.push(arrAirportArray[j].IATA);
                let myFlightApi = new flightsApi(depAirportArray[i].IATA, arrAirportArray[j].IATA, searchParams.departDate, searchParams.returnDate, 
                    searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass.code, !searchParams.isRoundTrip,
                    depAirportArray[i]["TravelTime"], arrAirportArray[j]["TravelTime"]);
                // myFlightApi.airlines.forEach(element => resultInfo.airlines.push(element));
                stackedAirlines.push(myFlightApi.airlines);
                trips.push(myFlightApi.queryApi());
            }
        }
        tripList = await Promise.all(trips)
        tripList = tripList.flat();

        resultInfo.airlines = stackedAirlines.flat();
        resultInfo.trips = sortTrips(trips, "flightPrice");
        resultInfo.minPrice = resultInfo.trips[0].flightPrice;
        resultInfo.maxPrice = resultInfo.trips[tripList.length - 1].flightPrice;

        logger.info(resultInfo);
        res.status(200).send(resultInfo);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

mongoRouter.post("/log", async (req, res) => {
    let level = req.body.level;
    let msg = req.body.message;
    let filename = req.body.fileName;
    let lineNumber = req.body.lineNumber;
    let columnNumber = req.body.columnNumber;
    //add switch case for different levels (debug, error, trace, etc)
    logger.info("clientside file " + filename + " " + msg + " line " + lineNumber + " col " + columnNumber);
});

mongoRouter.post("/login", async (req, res) => {
    let cred = await Credentials.findOne({email: req.body.email});
    // if email exists in DB, check if passwords match
    if(cred) {
        bcrypt.compare(req.body.password, cred["password"]).then(
            passwordMatch => passwordMatch ? res.status(200).send(true): res.status(200).send(false)
        );
    } else {
        logger.info("Log in failure: user does not exist");
        res.status(200).send(false);
    }
});

mongoRouter.post("/signup", async (req, res) => {
    const saltRounds = 10;
    let cred = await Credentials.findOne({email: req.body.email});
    // if email doesnt already exist, hash pass and add to DB
    if(!cred) {
        const newUser = new Credentials({
            _id: new ObjectId(),
            email: req.body.email,
            password: req.body.password
        });
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                newUser.password = hash;
                newUser.save()
                if(!err) {
                    res.status(200).send(true)
                } else {
                    res.status(200).send(false)
                }
            });
        });
    } else {
        logger.info("Sign up failure: user already exists");
        res.status(200).send(false);
    }

});
