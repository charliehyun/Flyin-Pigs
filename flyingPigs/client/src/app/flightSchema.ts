export interface FlightSchema {
    airlines:string[];
    departureAirport:string;
    arrivalAirport:string;
    departureTime:string;
    arrivalTime:string;
    flightTime:number;
    numberOfStops:number;
    // price:number;
    stopOvers: StopOverFlightSchema[];
    // timeToAirport:number;
    // timeFromAirport:number;
}
export interface StopOverFlightSchema {
    airline:string;
    depAirportCode:string;
    arrAirportCode:string;
    stopOverDuration:number;
    departTime:string;
    arrivalTime:string;
}

export interface TripSchema {
    departingFlight: FlightSchema;
    returningFlight?: FlightSchema;
    timeToAirportA: number;
    timeToAirportB: number;
    flightPrice: number;
}