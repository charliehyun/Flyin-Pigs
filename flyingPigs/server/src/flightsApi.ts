const https = require('https');
const Amadeus = require('amadeus');

import log4js from "log4js";

import {Flight, stopOverFlight, Trip} from "./flight";

export class flightsApi {

    amadeus = new Amadeus({
      clientId: 'Y36ktl5qiSaJ03ViG5RcTViG2OeXx1ml',
      clientSecret: '30GIvPsJ6joTDJYI'
    });
//     apiKey = `633fc180b8f7611a58d22a60`;
    departureAirport:string;
    arrivalAirport:string;
    departureDate:string;
    arrivalDate:string = "";
    adultPassengers:number = 0;
    childrenPassengers:number = 0;
    infantPassengers:number = 0;
    cabinClass:string = "ECONOMY";
    oneWayRoundTrip:string = "onewaytrip";
    response:any;
    timeToAirportA:number = -1;
    timeToAirportB:number = -1;
    logger:log4js.Logger;

    constructor(departure:string, arrival:string, departureDate:string, arrivalDate:string,
    adults:number, children:number, infants:number, cabin:string, oneway:boolean, timeToAirportA:number, timeToAirportB:number)
    {
        this.departureAirport = departure;
        this.arrivalAirport = arrival;
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        this.adultPassengers = adults;
        this.childrenPassengers = children;
        this.infantPassengers = infants;
        this.cabinClass = cabin;
        this.timeToAirportA = timeToAirportA;
        this.timeToAirportB = timeToAirportB;
        if(!oneway) {
            this.oneWayRoundTrip = "roundtrip";
        }
        this.logger = log4js.getLogger();
    }
    async queryApi() {
        let logger = this.logger;
        // let that = this;
        let returnTripObjects: Trip[] = [];

        if(this.arrivalDate) {
            this.logger.info("return date given");
            await this.amadeus.shopping.flightOffersSearch.get({
                originLocationCode: this.departureAirport,
                destinationLocationCode: this.arrivalAirport,
                departureDate: this.departureDate,
                returnDate: this.arrivalDate,
                adults: this.adultPassengers,
                children: this.childrenPassengers,
                infants: this.infantPassengers,
                travelClass: this.cabinClass,
                currencyCode: 'USD',
                max: 10,
            }).then((response: { data: any; }) => {
                returnTripObjects = this.parseApi(response.data)
            }).catch((error: any) => logger.warn("api error: ", error.code));
            // .then(function(response: { data: any; }){
            //     // logger.info("api response: ", response.data);
            //     returnTripObjects = that.parseApi(response.data);
            // }).catch(function(responseError: { code: any; }){
            //     logger.warn("api error: ", this.originLocationCode, this.destinationLocationCode);
            //     logger.warn("api error: ", responseError.code);
            // });
        }
        else {
            this.logger.info("no return date given");
            await this.amadeus.shopping.flightOffersSearch.get({
                originLocationCode: this.departureAirport,
                destinationLocationCode: this.arrivalAirport,
                departureDate: this.departureDate,
                adults: this.adultPassengers,
                children: this.childrenPassengers,
                infants: this.infantPassengers,
                travelClass: this.cabinClass,
                currencyCode: 'USD',
                max: 10,
            }).then((response: { data: any; }) => {
                returnTripObjects = this.parseApi(response.data)
            }).catch((error: any) => logger.warn("api error: ", error.code));
            // .then(function(response: { data: any; }){
            //     logger.info("api response received");
            //     returnTripObjects = that.parseApi(response.data);
            // }).catch(function(responseError: { code: any; }){
            //     logger.warn("api error: ", this.originLocationCode, this.destinationLocationCode);
            //     logger.warn("api error: ", responseError.code);
            // });
        }

        this.logger.info("trip objects: ", returnTripObjects);
        return returnTripObjects;
    }

    parseApi(apiResponse: any): Trip[] {
        console.log("in parseApi");
        let returnTripObjects: Trip[] = [];
        // let that = this;
        console.log("parseApi param: ", apiResponse);
        apiResponse.forEach(function (flight:any, index:number) {
            console.log("parseApi: ", index);
            if(flight.itineraries.length < 1) {
                this.logger.info("FLIGHT ERROR: ", flight);
                this.logger.info("NO ITINERARIES");
            }
            else {
                console.log("parseApi else");
                let departingFlight = this.parseItinerary(flight.itineraries[0]);
                console.log("parseApi pared the itinerary");
                let returningFlight = null;
                if(!flight.oneWay && flight.itineraries.length > 1) {
                    returningFlight = this.parseItinerary(flight.itineraries[1]);
                }
                console.log("parseApi creating new trip");
                let newTrip = new Trip(this.timeToAirportA, this.timeToAirportB, flight.price.total, departingFlight, returningFlight);
                console.log("parseApi createad new trip");
                returnTripObjects.push(newTrip);
                console.log("parseApi end else");
            }
        }, this);
        console.log("parseApi: ", returnTripObjects);
        return returnTripObjects;
    }

    parseItinerary(itinerary: any) {
        console.log("in parseItinerary");
        let segments = itinerary.segments;
        let newFlight = new Flight(this.departureAirport, this.arrivalAirport,
            segments[0].departure.at, segments[segments.length - 1].arrival.at,
            this.parseApiTimeToSeconds(itinerary.duration), segments.length - 1);
        console.log(1);
        // loop through segments to add layovers. Skip the last segment
        for(let  i = 0; i < segments.length - 1; i++) {
            let curr = segments[i];
            let next = segments[i + 1];
            console.log(2);
            let stopOver = new stopOverFlight(curr.carrierCode, curr.departure.iataCode, curr.arrival.iataCode, this.calculateStopover(next.arrival.at, curr.departure.at), curr.departure.at, next.arrival.at);
            console.log(3);
            newFlight.addStopOver(stopOver);
            console.log(3.1);
            newFlight.addAirline(curr.carrierCode);
            console.log(3.2);
            if(i == segments.length - 2) {
                newFlight.addAirline(next.carrierCode);
            }
            console.log(4);
        }
        console.log(5);
        return newFlight;
    }

    parseApiTimeToSeconds(apiTime: string): number {
        // The time returned by the API is in the format: PTXXHXXM
        // ex: PT17H3M meaning 17 hours 3 minutes
        let seconds = -1;

        let t = apiTime.indexOf('T');
        let h = apiTime.indexOf('H');
        let m = apiTime.indexOf("M");

        let hours = parseInt(apiTime.slice(t + 1, h));
        let minutes = parseInt(apiTime.slice(h + 1, m));

        seconds = (3600 * hours) + (60 * minutes);

        return seconds;
    }

    calculateStopover(departTime: string, arriveTime: string): number {
        let seconds = -1;
        seconds = (new Date(arriveTime).getTime() - new Date(departTime).getTime()) / 1000;
        return seconds;
    }

//     async queryApi() {
//         var apiString = ""
//         if (this.oneWayRoundTrip === "onewaytrip") {
//             apiString = `https://api.flightapi.io/` +
//                 this.oneWayRoundTrip + `/` +
//                 this.apiKey +  `/` + this.departureAirport + `/` + this.arrivalAirport + `/` +
//                 this.departureDate + `/` +
//                 this.adultPassengers + `/` + this.childrenPassengers + `/` + this.infantPassengers + `/` +
//                 this.cabinClass + `/USD`;
//         }
//         else {
//             apiString = `https://api.flightapi.io/` +
//                 this.oneWayRoundTrip + `/` +
//                 this.apiKey +  `/` + this.departureAirport + `/` + this.arrivalAirport + `/` +
//                 this.departureDate + `/` + this.arrivalDate + `/` +
//                 this.adultPassengers + `/` + this.childrenPassengers + `/` + this.infantPassengers + `/` +
//                 this.cabinClass + `/USD`;
//         }
//         let promise = new Promise((resolve, reject) => {
//             https.get(apiString, (resp:any) => {
//                 let data = '';
//                 resp.on('data', (chunk:any) => {
//                     data += chunk
//                 });

//                 resp.on('end', () =>{
//                     resolve(JSON.parse(data));
//                 });
//             }).on("error", (err:any) => {
//                 console.log("Error: " + err.message);
//             });

//         });

//         this.response = await promise;
//         if (this.oneWayRoundTrip === "onewaytrip")
//         {
//             return this.parseResponseOneWay();
//         }
//         else
//         {
//             return this.parseResponseRoundTrip();
//         }

//     }
//     parseResponseOneWay(): Flight[][] {
//         let returnFlightObjects: Flight[][] = [];

//         let myObj: any = this.response;
//         let flightLegs = myObj.legs;
//         flightLegs.forEach((value:any) => {
//             if (value.stopoversCount <= 2) {
//                 //create new flight with most data

//                 let newFlight = new Flight(value.airlineCodes, this.departureAirport, this.arrivalAirport,
//                     value.departureDateTime, value.arrivalDateTime,
//                     value.durationMinutes * 60, value.stopoversCount, value.id);

//                 //add stopovers
//                 let flightStopovers:stopOverFlight[] = [];
//                 value.segments.forEach((stopover: any) => {
//                     flightStopovers.push(new stopOverFlight(stopover.arrivalAirportCode,
//                         stopover.durationMinutes * 60, stopover.arrivalDateTime));
//                 });

//                 newFlight.addStopOvers(flightStopovers);
//                 returnFlightObjects.push([newFlight]);
//             }
//         });

//         //now add the prices.
//         let tripIds = myObj.trips;
//         let prices = myObj.fares;
//         //map legIds to tripIds for searching later.
//         let mapLegIdToTripId = new Map<string, string>();
//         tripIds.forEach( (allIds:any ) =>{
//            mapLegIdToTripId.set(allIds.legIds[0], allIds.id);
//         });

//         //map tripIds to prices for searching.
//         let mapTripIdToPrice = new Map<string, number>();
//         prices.forEach( (fare:any) => {
//             mapTripIdToPrice.set(fare.tripId, fare.price.totalAmountUsd);
//         });

//         //go through and grab the prices!!
//         returnFlightObjects.forEach((flightObject:Flight[]) => {
//             let tripId = mapLegIdToTripId.get(flightObject[0].legId);
//             let price = mapTripIdToPrice.get(tripId);
//             flightObject[0].addPrice(price);
//         });

//         return returnFlightObjects;
//     }

//     parseResponseRoundTrip(): Flight[][] {

//         let myObj: any = this.response;
//         let flightLegs = myObj.legs;
//         let mapLegIdToFlight = new Map<string, Flight>();
//         //go through legs and create flights if they fit the criteria.
//         //also make a hash map from legId to Flight
//         flightLegs.forEach( (leg:any) => {
//             if (leg.stopoversCount <= 2) {
//                 let newFlight = new Flight(leg.airlineCodes, this.departureAirport, this.arrivalAirport,
//                     leg.departureDateTime, leg.arrivalDateTime,
//                     leg.durationMinutes * 60, leg.stopoversCount, leg.id);

//                 //add stopovers
//                 let flightStopovers:stopOverFlight[] = [];
//                 leg.segments.forEach((stopover: any) => {
//                     flightStopovers.push(new stopOverFlight(stopover.arrivalAirportCode,
//                         stopover.durationMinutes * 60, stopover.arrivalDateTime));
//                 });

//                 newFlight.addStopOvers(flightStopovers);

//                 mapLegIdToFlight.set(leg.id, newFlight);
//             }
//         });
//         //we now have a list of flights. We need to iterate through tripIds and check that each of its legIds are
//         //in the previously made hashmap.
//         let tripIds = myObj.trips;
//         let prices = myObj.fares;

//         //map tripIds to prices for searching.
//         let mapTripIdToPrice = new Map<string, number>();
//         prices.forEach( (fare:any) => {
//             mapTripIdToPrice.set(fare.tripId, fare.price.totalAmountUsd);
//         });

//         //go through all tripIds and only make a flights tuple for the ones that are valid and in our hashmap.
//         let roundTripReturnFlights:Flight[][] = [];

//         tripIds.forEach( (allIds:any) => {
//             let flightLegOne = allIds.legIds[0];
//             let flightLegTwo = allIds.legIds[1];
//             if (mapLegIdToFlight.has(flightLegOne) && mapLegIdToFlight.has(flightLegTwo))
//             {
//                 let price = mapTripIdToPrice.get(allIds.id);
//                 mapLegIdToFlight.get(flightLegOne).addPrice(price);
//                 mapLegIdToFlight.get(flightLegTwo).addPrice(price);
//                 roundTripReturnFlights.push([mapLegIdToFlight.get(flightLegOne), mapLegIdToFlight.get(flightLegTwo)]);
//             }
//         });

//         return roundTripReturnFlights;
//     }

}

