const https = require('https');
const Amadeus = require('amadeus');

import log4js from "log4js";

import {Flight, stopOverFlight} from "./flight";

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
    cabinClass:string = "Economy";
    oneWayRoundTrip:string = "onewaytrip";
    response:any;
    logger:log4js.Logger;
    constructor(departure:string, arrival:string, departureDate:string, arrivalDate:string,
    adults:number, children:number, infants:number, cabin:string, oneway:boolean)
    {
        this.departureAirport = departure;
        this.arrivalAirport = arrival;
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        this.adultPassengers = adults;
        this.childrenPassengers = children;
        this.infantPassengers = infants;
        this.cabinClass = cabin;
        if(!oneway) {
            this.oneWayRoundTrip = "roundtrip";
        }
        this.logger = log4js.getLogger();
    }
    async queryApi() {
        let returnFlightObjects: Flight[][] = [];
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
        }).then(function(response: { data: any; }){
            this.logger.info(response.data);
            this.parseApi(response.data);
        }).catch(function(responseError: { code: any; }){
            this.logger.warn(responseError.code);
        });
        return returnFlightObjects;
    }

    parseApi(): Flight[][] {
        throw new Error("Function not implemented.");
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

