export class Flight{
    airlines:string[];
    departureAirport:string;
    arrivalAirport:string;
    departureTime:string;
    arrivalTime:string;
    flightTime:number;
    numberOfStops:number;
    stopOvers: stopOverFlight[];
    // timeToAirport:number;
    // timeFromAirport:number;

    constructor(dpa:string, ara:string, dpt:string, art:string, flt:number, nos:number)
    {
        this.departureAirport = dpa;
        this.arrivalAirport = ara;
        this.departureTime = dpt;
        this.arrivalTime = art;
        this.flightTime = flt;
        this.numberOfStops = nos;
        this.stopOvers = [];
        this.airlines = [];
        // this.timeToAirport = timeToAirport;
        // this.timeFromAirport = timeFromAirport;
    }

    addStopOver(stopOver:stopOverFlight) {
        this.stopOvers.push(stopOver);
    }
    
    addAirline(al:string) {
        if(!this.airlines.includes(al)) {
            this.airlines.push(al);
        }
    }
}

export class stopOverFlight {
    airline:string;
    depAirportCode:string;
    arrAirportCode:string;
    stopOverDuration:number;
    arrivalTime:string;
    departTime:string;

    constructor(al:string, depAirportCode:string, arrAirportCode:string, stopOverDuration:number, departTime:string, arrivalTime:string) {
        this.airline = al;
        this.depAirportCode = depAirportCode;
        this.arrAirportCode = arrAirportCode;
        this.stopOverDuration = stopOverDuration;
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