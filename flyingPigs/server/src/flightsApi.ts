const https = require('https');
const Amadeus = require('amadeus');

import log4js from "log4js";

import {Flight, TravelSegmentSchema, Trip} from "./flight";

export class flightsApi {

    amadeus = new Amadeus({
      clientId: process.env.AMADEUS_KEY,
      clientSecret: process.env.AMADEUS_SECRET
    });
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
    stackedAirlines: string[];
    airlineCodes = {};

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
                max: 30,
            }).then((response: any) => {
                this.airlineCodes = response.result.dictionaries.carriers;
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
                max: 30,
            }).then((response: any) => {
                this.airlineCodes = response.result.dictionaries.carriers;
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
        let returnTripObjects: Trip[] = [];
        // let that = this;
        apiResponse.forEach(function (flight:any, index:number) {
            if(flight.itineraries.length < 1) {
                this.logger.info("FLIGHT ERROR: ", flight);
                this.logger.info("NO ITINERARIES");
            }
            else {
                let departingFlight = this.parseItinerary(flight.itineraries[0]);
                // this.stackedAirlines.push(departingFlight.airlines);
                let returningFlight = null;
                if(!flight.oneWay && flight.itineraries.length > 1) {
                    returningFlight = this.parseItinerary(flight.itineraries[1]);
                    // this.stackedAirlines.push(returningFlight.airlines);
                }
                let newTrip = new Trip(this.timeToAirportA, this.timeToAirportB, parseFloat(flight.price.total), departingFlight, returningFlight, flight.numberOfBookableSeats, flight.id);
                returnTripObjects.push(newTrip);
            }
        }, this);
        return returnTripObjects;
    }

    parseItinerary(itinerary: any) {
        let segments = itinerary.segments;
        let newFlight = new Flight(segments[0].departure.iataCode, segments[segments.length - 1].arrival.iataCode,
            segments[0].departure.at, segments[segments.length - 1].arrival.at,
            this.parseApiTimeToSeconds(itinerary.duration), segments.length - 1);
        // loop through segments to add layovers. Skip the last segment
        for(let  i = 0; i < segments.length - 1; i++) {
            let curr = segments[i];
            let next = segments[i + 1];
            let stopOver = new TravelSegmentSchema(this.airlineCodes[curr.carrierCode], curr.departure.iataCode, curr.arrival.iataCode, this.parseApiTimeToSeconds(curr.duration), curr.departure.at, next.arrival.at, this.calculateStopover(next.arrival.at, curr.departure.at));
            newFlight.addSegment(stopOver);
            newFlight.addAirline(this.airlineCodes[curr.carrierCode]);
            // this.airlines.push(curr.carrierCode);
            if(i == segments.length - 2) {
                newFlight.addAirline(this.airlineCodes[next.carrierCode]);
                // this.airlines.push(next.carrierCode);
            }
        }
        return newFlight;
    }

    parseApiTimeToSeconds(apiTime: string): number {
        // The time returned by the API is in the format: PTXXHXXM
        // ex: PT17H3M meaning 17 hours 3 minutes
        // Note: String might not have an H or M value
        let seconds = -1;

        let t = apiTime.indexOf('T');
        let h = apiTime.indexOf('H');
        let m = apiTime.indexOf("M");
        let hours = 0;
        let minutes = 0;

        if(h > -1) {
            hours = parseInt(apiTime.slice(t + 1, h));
        }
        if(m > -1) {
            minutes = parseInt(apiTime.slice(h + 1, m));
        }

        seconds = (3600 * hours) + (60 * minutes);

        return seconds;
    }

    calculateStopover(departTime: string, arriveTime: string): number {
        let seconds = -1;
        seconds = (new Date(arriveTime).getTime() - new Date(departTime).getTime()) / 1000;
        return seconds;
    }
}

