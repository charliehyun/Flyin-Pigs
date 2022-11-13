export class Flight{
    airlines:string[];
    departureAirport:string;
    arrivalAirport:string;
    departureTime:string;
    arrivalTime:string;
    flightTime:number;
    numberOfStops:number;
    segments: flightSegment[];
    // timeToAirport:number;
    // timeFromAirport:number;

    constructor(departureAirport:string, arrivalAirport:string, departureTime:string, arrivalTime:string, flightTime:number, numberOfStops:number)
    {
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.flightTime = flightTime;
        this.numberOfStops = numberOfStops;
        this.segments = [];
        this.airlines = [];
        // this.timeToAirport = timeToAirport;
        // this.timeFromAirport = timeFromAirport;
    }

    addSegment(segment:flightSegment) {
        this.segments.push(segment);
    }
    
    addAirline(al:string) {
        if(!this.airlines.includes(al)) {
            this.airlines.push(al);
        }
    }
}

export class flightSegment {
    airline:string;
    depAirportCode:string;
    arrAirportCode:string;
    segmentDuration:number;
    arrivalTime:string;
    departTime:string;

    constructor(al:string, depAirportCode:string, arrAirportCode:string, segmentDuration:number, departTime:string, arrivalTime:string) {
        this.airline = al;
        this.depAirportCode = depAirportCode;
        this.arrAirportCode = arrAirportCode;
        this.segmentDuration = segmentDuration;
        this.departTime = departTime;
        this.arrivalTime = arrivalTime;
    }
}

export class Trip {
    departingFlight: Flight;
    returningFlight?: Flight;
    timeToAirportA: number;
    timeToAirportB: number;
    flightPrice:number;
    totalDepTime: number;
    totalRetTime?: number;

    constructor(timeToAirportA: number, timeToAirportB: number, flightPrice:number, departingFlight: Flight, returningFlight: Flight) {
        this.timeToAirportA = timeToAirportA;
        this.timeToAirportB = timeToAirportB;
        this.flightPrice = flightPrice;
        this.departingFlight = departingFlight;
        if(returningFlight) {
            this.returningFlight = returningFlight;
            this.totalRetTime = timeToAirportA + timeToAirportB + returningFlight.flightTime;
        }
        this.totalDepTime = timeToAirportA + timeToAirportB + departingFlight.flightTime;
    }
}

export class ResultInfo {
    airlines: string[];
    depAirlines: string[];
    arrAirlines: string[];
    minPrice?: number;
    maxPrice?: number;
    trips: Trip[];

    constructor(airlines: string[], depAirlines: string[], arrAirlines: string[], trips: Trip[]) {
        this.airlines = airlines;
        this.depAirlines = depAirlines;
        this.arrAirlines = arrAirlines;
        this.trips = trips;
    }

}

export function removeDuplicates(arr: string[]) {
    return Array.from(new Set(arr));
}

export function sortTrips(trips: Trip[], field: string): Trip[] {
    let sortedTrips = trips;

    if(field == "flightPrice") {
        sortedTrips.sort(compareFlightPrice);
    }
    return sortedTrips;
}

function compareFlightPrice(a: Trip, b: Trip) {
    if (a.flightPrice < b.flightPrice) {
      return -1;
    }
    if (a.flightPrice > b.flightPrice) {
      return 1;
    }
    return 0;
}