export interface FlightSchema {
    airlines:string[];
    departureAirport:string;
    arrivalAirport:string;
    departureTime:string;
    arrivalTime:string;
    flightTime:number;
    numberOfStops:number;
    price:number;
    legId:string;
    stopOvers: StopOverFlightSchema[];
}
export interface StopOverFlightSchema {
    airportCode:string;
    stopOverDuration:number;
    arrivalTime:string;
}