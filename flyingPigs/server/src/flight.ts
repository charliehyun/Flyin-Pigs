export class Flight{
    airlines:string[];
    departureAirport:string;
    arrivalAirport:string;
    departureTime:string;
    arrivalTime:string;
    flightTime:number;
    numberOfStops:number;
    price:number;
    legId:string;
    stopOvers: stopOverFlight[];

    constructor(air:string[], dpa:string, ara:string, dpt:string, art:string, flt:number, nos:number, legId:string)
    {
        this.airlines = air;
        this.departureAirport = dpa;
        this.arrivalAirport = ara;
        this.departureTime = dpt;
        this.arrivalTime = art;
        this.flightTime = flt;
        this.numberOfStops = nos;
        this.legId = legId;
    }

    addStopOvers(stopOvers:stopOverFlight[])
    {
        this.stopOvers = stopOvers;
    }

    addPrice(price:number)
    {
        this.price = price;
    }

}

export class stopOverFlight {
    airportCode:string;
    stopOverDuration:number;
    arrivalTime:string;

    constructor(airportCode:string, stopOverDuration:number, arrivalTime:string) {
        this.airportCode = airportCode;
        this.stopOverDuration = stopOverDuration;
        this.arrivalTime = arrivalTime;
    }
}