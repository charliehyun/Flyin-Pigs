import e, * as express from "express";
import {airportFinder} from "./findAirports";
export const mongoRouter = express.Router();
import {flightsApi} from "./flightsApi";
mongoRouter.use(express.json());
var Airport = require("./airport");
import log4js from "log4js";
import { TravelMode } from "@googlemaps/google-maps-services-js";
import { Trip, ResultInfo, sortTrips, removeDuplicates, Flight } from "./flight";
import { ObjectId } from "mongodb";
import { mongo } from "mongoose";
import { timeStamp } from "console";
const crypto = require('crypto');
var logger = log4js.getLogger();
var Credentials = require("./credentials");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { expressjwt: jwt } = require("express-jwt");

let auth = jwt({ 
    secret: String(process.env.MY_SECRET), 
    algorithms: ["HS256"], 
    userProperty: 'payload'
});

mongoRouter.get("/", async (_req, res) => {
    try {
        //let airportsCollection = mongoose.model('Airport');
        const airports = await Airport.find({});
        res.status(200).send(airports);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

mongoRouter.post("/setAddress", async (req, res) => {
    Credentials.findOne({email: req.body.email}).then((user) => {
        if (!user) {
            // res.status(200).send({
            //     message: 'invalid-link',
            // });
            logger.info("NO USER WITH SPECIFIED EMAIL");
            res.status(200).send(false);

            // console.error('password reset link is invalid or has expired');
            // res.status(403).send({message: 'password reset link is invalid or has expired'});
        } else {
            logger.info("setting address");
            user.address = req.body.address;
            user.save();
            res.status(200).send(true);
        }
    });
});
mongoRouter.post("/getUser", async (req, res) => {
    logger.info("GET USER ROUTE");
    Credentials.findOne({email: req.body.email}).then((user) => {
        if (!user) {
            // res.status(200).send({
            //     message: 'invalid-link',
            // });
            logger.info("NO USER WITH SPECIFIED EMAIL");
            res.status(200).send(false);

            // console.error('password reset link is invalid or has expired');
            // res.status(403).send({message: 'password reset link is invalid or has expired'});
        } else {
            logger.info("returning user");
            res.status(200).send(user);
        }
    });
});
mongoRouter.post("/search", async (req, res) => {
    try {
        let searchParams = req.body;
        let tripList:Trip[] = [];
        let resultInfo: ResultInfo = {
            airlines: [],
            depAirports: [],
            arrAirports: [],
            minPrice: 0,
            maxPrice: 0,
            trips: [],
        };
        let airlinesDuplicates: string[] = [];

        let myDepFinder = new airportFinder();
        let depPrefilter = await myDepFinder.findAirportsInRange(searchParams.departCoord.lat, searchParams.departCoord.lng, searchParams.maxTimeStart.sec, searchParams.selectedDTransport.code);        
        let depAirportArray = await myDepFinder.findAirports(searchParams.departCoord.lat, searchParams.departCoord.lng, depPrefilter, searchParams.maxTimeStart.sec, searchParams.selectedDTransport.code);
        let myArrFinder = new airportFinder();
        // let arrPrefilter = await myArrFinder.findAirportsInRange(searchParams.departCoord.lat, searchParams.departCoord.lng, searchParams.maxTimeStart.sec, searchParams.selectedTransport.code);
        let arrPrefilter = await myArrFinder.findAirportsInRange(searchParams.arriveCoord.lat, searchParams.arriveCoord.lng, searchParams.maxTimeEnd.sec, searchParams.selectedATransport.code);        
        // let arrAirportArray = await myArrFinder.findAirport(searchParams.departCoord.lat, searchParams.departCoord.lng, arrPrefilter, searchParams.maxTimeStart.sec, searchParams.selectedTransport.code);
        let arrAirportArray = await myArrFinder.findAirports(searchParams.arriveCoord.lat, searchParams.arriveCoord.lng, arrPrefilter, searchParams.maxTimeEnd.sec, searchParams.selectedATransport.code);
        // console.log(arrAirportArray);
        let trips = [];

        if(searchParams.selectedDTransport.code === searchParams.selectedATransport.code) {
            let emptyFlight = new Flight("", "", "", "", 0, 0);
            emptyFlight.addAirline(searchParams.selectedDTransport.name);
            let times = await myDepFinder.getDistanceInSec(searchParams.departCoord, searchParams.arriveCoord, searchParams.selectedDTransport.code);
            let tempTrip: Trip;
            if(searchParams.isRoundTrip) {
                tempTrip = new Trip(0, 0, 0, emptyFlight, emptyFlight, Infinity, "0");
                tempTrip.setTotalDepTime(times.timeTo);
                tempTrip.setTotalRetTime(times.timeBack);
            }
            else{
                tempTrip = new Trip(0, 0, 0, emptyFlight, undefined, Infinity, "0");
                tempTrip.setTotalDepTime(times.timeTo);
            }
            trips.push(tempTrip);
        }
        else {            
            let emptyFlight1 = new Flight("", "", "", "", 0, 0);
            emptyFlight1.addAirline(searchParams.selectedDTransport.name);
            let emptyFlight2 = new Flight("", "", "", "", 0, 0);
            emptyFlight2.addAirline(searchParams.selectedATransport.name);

            let times1 = await myDepFinder.getDistanceInSec(searchParams.departCoord, searchParams.arriveCoord, searchParams.selectedDTransport.code);
            let times2 = await myDepFinder.getDistanceInSec(searchParams.departCoord, searchParams.arriveCoord, searchParams.selectedATransport.code);
            let tempTrip1: Trip;
            let tempTrip2: Trip;
            if(searchParams.isRoundTrip) {
                tempTrip1 = new Trip(0, 0, 0, emptyFlight1, emptyFlight1, Infinity, "-1");
                tempTrip1.setTotalDepTime(times1.timeTo);
                tempTrip1.setTotalRetTime(times1.timeBack);

                tempTrip2 = new Trip(0, 0, 0, emptyFlight2, emptyFlight2, Infinity, "0");
                tempTrip2.setTotalDepTime(times2.timeTo);
                tempTrip2.setTotalRetTime(times2.timeBack);
            }
            else{
                tempTrip1 = new Trip(0, 0, 0, emptyFlight1, undefined, Infinity, "-1");
                tempTrip1.setTotalDepTime(times1.timeTo);

                tempTrip2 = new Trip(0, 0, 0, emptyFlight2, undefined, Infinity, "0");
                tempTrip2.setTotalDepTime(times2.timeTo);
            }
            trips.push(tempTrip1);    
            trips.push(tempTrip2);       
        }

        for(let i = 0; i < depAirportArray.length; i++) {
            resultInfo.depAirports.push(depAirportArray[i].IATA);
            for(let j = 0; j < arrAirportArray.length; j++) {
                if(i == 0) {
                    resultInfo.arrAirports.push(arrAirportArray[j].IATA);
                }
                if(depAirportArray[i].IATA !== arrAirportArray[j].IATA){
                    if(searchParams.dateRange) {
                        logger.info("airports going: ", depAirportArray[i].IATA, " ", arrAirportArray[j].IATA);
                        //get the date of cheapest flight.
                        let myCheapestDateApi = new flightsApi(depAirportArray[i].IATA, arrAirportArray[j].IATA, searchParams.departDate, searchParams.returnDate,
                            searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass.code, !searchParams.isRoundTrip,
                            depAirportArray[i]["TravelTime"], arrAirportArray[j]["TravelTime"], searchParams.dateRange);
                        let departDate = await myCheapestDateApi.getCheapestDates();
                        //now with new departDate!
                        if (departDate != "") {
                            let myFlightApi = new flightsApi(depAirportArray[i].IATA, arrAirportArray[j].IATA, departDate, searchParams.returnDate,
                                searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass.code, false,
                                depAirportArray[i]["TravelTime"], arrAirportArray[j]["TravelTime"]);
                            trips.push(myFlightApi.queryApi());
                        }
                    }
                    else {
                        let myFlightApi = new flightsApi(depAirportArray[i].IATA, arrAirportArray[j].IATA, searchParams.departDate, searchParams.returnDate,
                            searchParams.adultPass, searchParams.childPass, searchParams.infantPass, searchParams.selectedClass.code, !searchParams.isRoundTrip,
                            depAirportArray[i]["TravelTime"], arrAirportArray[j]["TravelTime"]);
                        trips.push(myFlightApi.queryApi());
                    }

                }
            }
        }
        
        tripList = await Promise.all(trips)
        tripList = tripList.flat();

        resultInfo.trips = sortTrips(tripList, "flightPrice");
        resultInfo.minPrice = resultInfo.trips[0].flightPrice;
        resultInfo.maxPrice = resultInfo.trips[tripList.length - 1].flightPrice;
        
        tripList.forEach(function(trip, index) {
            logger.info("airlines for one trip", trip.departingFlight.airlines);
            airlinesDuplicates = airlinesDuplicates.concat(trip.departingFlight.airlines);
            if(trip.returningFlight) {
                airlinesDuplicates = airlinesDuplicates.concat(trip.returningFlight.airlines);
            }
        });
        resultInfo.airlines = removeDuplicates(airlinesDuplicates);
        logger.info("all airlines: ", resultInfo.airlines);
        logger.info("resultInfo.depAirports: ", resultInfo.depAirports);
        logger.info("resultInfo.arrAirports: ", resultInfo.arrAirports);
        logger.info("resultInfo: ", resultInfo);
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

// mongoRouter.get("/profile", jwt({ secret: process.env.MY_SECRET, userProperty: 'payload' }), async(req, res) => {
mongoRouter.get("/profile", auth, async(req, res) => {

    // If no user ID exists in the JWT return a 401
  if (!req['payload']._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    Credentials
      .findById(req['payload']._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }
});

mongoRouter.post("/login", async (req, res) => {
    let cred = await Credentials.findOne({email: req.body.email});
    // if email exists in DB, check if passwords match
    if(cred) {
        // bcrypt.compare(req.body.password, cred["password"]).then(
        //     passwordMatch => passwordMatch ? res.status(200).send(true): res.status(200).send(false)
        // );
        bcrypt.compare(req.body.password, cred["password"]).then(function(result) {
            if(result == true) {
                let tok;
                tok = cred.generateJwt();
                res.status(200).send({success: true, token: tok, message: "Log in successful"});
            }
            else {
                res.status(200).send({success: false, message: 'Log in failure: passwords do not match'});
            }
        });
    } else {
        logger.info("Log in failure: user does not exist");
        res.status(200).send({success: false, message: 'Log in failure: user does not exist'});
    }
});
mongoRouter.post("/signout", async (req, res) => {
    try {
        req.body.session = null;
        return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
    }
});
mongoRouter.post("/signup", async (req, res) => {
    const saltRounds = 10;
    let cred = await Credentials.findOne({email: req.body.email});
    // if email doesnt already exist, hash pass and add to DB
    if(!cred) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                const newUser = new Credentials({
                    _id: new ObjectId(),
                    email: req.body.email,
                    password: hash,
                });
                newUser.save()
                if(!err) {
                    let tok;
                    tok = newUser.generateJwt();
                    res.status(200).send({success: true, token: tok, message: "Signup successful"});
                    // res.status(200).send(true)
                } else {
                    // TODO: change status and delete user if register fails
                    res.status(200).send({success: false, message: "sign up error during bcrypt"})
                }
            });
            if(err) {
                // TODO: change status
                res.status(200).send({success: false, message: "sign up error during bcrypt"})
            }
        });
    } else {
        logger.info("Sign up failure: user already exists");
        res.status(200).send({success:false, message: "Sign up failure: user already exists"});
    }

});

mongoRouter.post('/resetPassword', (req, res) => {
    console.log("INSIDE RESET PASSWORD ROUTE");
    console.log("reset password req: ", req);
    Credentials.findOne({resetPasswordToken: req.body.token}).then((user) => {
        if (!user) {
            // res.status(200).send({
            //     message: 'invalid-link',
            // });
            logger.info("NO USER WITH SPECIFIED TOKEN")
            res.status(200).send(false);

            // console.error('password reset link is invalid or has expired');
            // res.status(403).send({message: 'password reset link is invalid or has expired'});
        } else {
            if(user.resetPasswordExpires > Date.now()) {
                console.log("Valid reset link, time token is valid");
                const saltRounds = 10;

                user.resetPasswordToken = -1;
                user.resetPasswordExpires = -1;
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        user.password = hash;
                        user.save();
                        if(!err) {
                            res.status(200).send(true);
                        } else {
                            res.status(200).send(false);
                        }
                    });
                });
            }
            else {
                logger.info("RESET PASSWORD LINK EXPIRED")

                res.status(200).send(false);
                // console.error('password reset link is invalid or has expired');
                // res.status(403).send({message: 'password reset link is invalid or has expired'});
            }

        }
    });
});

mongoRouter.post('/loggedInResetPassword', (req, res) => {
    Credentials.findOne({email: req.body.email}).then((user) => {
        if (!user) {
            // res.status(200).send({
            //     message: 'invalid-link',
            // });
            logger.info("NO USER WITH SPECIFIED EMAIL! ", req.body.email);
            res.status(200).send(false);

            // console.error('password reset link is invalid or has expired');
            // res.status(403).send({message: 'password reset link is invalid or has expired'});
        } else {

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    user.password = hash;
                    user.save();
                    if(!err) {
                        res.status(200).send(true);
                    } else {
                        res.status(200).send(false);
                    }
                });
            });
        }
    });
});

mongoRouter.post("/submitForgotPassword", (req, res) =>
{
    // console.log("SUBMIT FORGOT PASSWORD REQ: ", req);
    Credentials.findOne({email: req.body.email}).then((user) => {

        if(user) {
            console.log('found user forgot password');
            //generate a unique hash token
            const token = crypto.randomBytes(20).toString('hex');

            //update the user with the token and set it to expire in 10 minutes

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 600000;
            user.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));


            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ADDRESSS,
                    pass: process.env.EMAIL_PASSWORD,
                }
            });
                
            var mailOptions = {
                from: process.env.EMAIL_ADDRESSS,
                to: req.body.email,
                subject: `Password Reset Link`,
                text: `click the link below to change your password:\n\nhttp://localhost:4200/reset-password?token=${token}`,
            };
                
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.status(200).send(false)
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).send(true)
                }
            });

            // const transporter = nodemailer.createTransport({
            //     service: 'gmail',

            //     //put credentials into an .env file later and include it in .gitignore
            //     // user: `${process.env.EMAIL_ADDRESSS}`,
            //     // pass: `${process.env.EMAIL_PASSWORD}`,
            //     auth: {
            //         user: "",
            //         pass: "",
            //     }
            // });

            // const mailOptions = {
            //     from: ``,
            //     to: req.body.email,
            //     subject: `Password Reset Link`,
            //     text: `click the link below to change your password:\n\nhttp://localhost:3000/reset/${token}`,
            // };

            // transporter.sendMail(mailOptions, (err, response) => {
            //     if(err) {
            //         //error
            //     }
            //     else {
            //         //sent
            //         console.log("email sent");
            //     }
            // });
        }
        else {
            // return res.status(403).json({email: "Email doesn't exist."});
            res.status(200).send(false)
        }
    })
    
});


mongoRouter.post("/autoReply", (req, res) =>
{

    const caseId = req.body.caseId;
    const type = req.body.type;

    let messages =  {
        feedback: "We appreciate your feedback."
                + "Thank you for being a valued customer of Flyin' Pigs!",
        inquiry: "We received your email and appreciate you taking the time to contact us.\n"
                 + "We will look into the issue and resolve it as soon as possible.\n"
                 + "In the mean time, if you have any follow up messages, please feel free to email us at: flyinPigs407+inquiry@gmail.com\n"
                 + 'With the subject :"Inquiry #' + caseId + ' Followup"' 
                 + "\n\n"
                 + "Sincerely,\n"
                 + "Flyin' Pigs Team"
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        //put credentials into an .env file later and include it in .gitignore
        // user: `${process.env.EMAIL_ADDRESSS}`,
        // pass: `${process.env.EMAIL_PASSWORD}`,
        auth: {
            user: process.env.EMAIL_ADDRESSS,
            pass: process.env.EMAIL_PASSWORD
        }
    });
        
    var mailOptions = {
        from: process.env.EMAIL_ADDRESSS,
        to: req.body.email,
        subject: `Flyin' Pigs Response to your Inquiry (Case #${caseId})`,
        text: messages[type],
    };
        
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(200).send(false)
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send(true)
        }
    }); 
});


mongoRouter.post("/feedback", (req, res) =>
{
    const caseId = crypto.randomBytes(8).toString('hex');
    const type = req.body.type;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        //put credentials into an .env file later and include it in .gitignore
        // user: `${process.env.EMAIL_ADDRESSS}`,
        // pass: `${process.env.EMAIL_PASSWORD}`,
        auth: {
            user: process.env.EMAIL_ADDRESSS,
            pass: process.env.EMAIL_PASSWORD
        }
    });
        
    var mailOptions = {
        from: process.env.EMAIL_ADDRESSS,
        to: 'flyinpigs407+' + type + '@gmail.com',
        subject: `Inquiry (Case #${caseId})`,
        text: req.body.email + '\n' + req.body.text,
    };
        
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            // TODO: change the status code and check the code in the front end.
            // We should not just send status 200 for everything.
            res.status(200).send({message: ""});
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({caseId: caseId});
        }
    }); 
});

mongoRouter.post("/addSearch", (req, res) => {
    let searchSchema = req.body.inputObject;

    logger.info("ADDING SEARCH TO ", req.body.email);
    //find user to update
        Credentials.updateOne(
        { email: req.body.email },
        { $push: { trackedSearches: searchSchema } },
        function(err, result) {
            if (err) {
                logger.info("ERROR", err)
                res.json(err);
            } else {
                logger.info("RESULT:", result)
                res.json(result);
            }
        });
});
mongoRouter.post("/updateSearch", (req, res) => {
    let searchSchema = req.body.inputObject;

    logger.info("UPDATING SEARCH TO ", req.body.email);
    //find user to update
    Credentials.updateOne(
        { email: req.body.email, trackedSearches: req.body.tracked },
        { $set: { "trackedSearches.$" : req.body.newTracked } },
        function(err, result) {
            if (err) {
                logger.info("ERROR", err)
                res.json(err);
            } else {
                logger.info("RESULT:", result)
                res.json(result);
            }
        });
        
})


