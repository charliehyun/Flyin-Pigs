export interface FlightSchema {
    airlines:string[];
    departureAirport:string;
    arrivalAirport:string;
    departureTime:string;
    arrivalTime:string;
    flightTime:number;
    numberOfStops:number;
    // price:number;
    segments: TravelSegmentSchema[];
    // timeToAirport:number;
    // timeFromAirport:number;
    displayDepartureTime: [string, string];
    displayArrivalTime: [string, string];
}

// export interface FlightSegmentSchema {
//     airline:string;
//     depAirportCode:string;
//     arrAirportCode:string;
//     segmentDuration:number;
//     departTime:string;
//     arrivalTime:string;
// }

export interface TravelSegmentSchema {
    travelType: string; // airline code, car, or transit
    depLocation: string;
    arrLocation: string;
    travelDuration: number;
    depTime: string;
    arrTime: string;
    waitDur: number;   // buffer time or layover time

    displayDepartureTime: [string, string];
    displayArrivalTime: [string, string];
}

export interface TripSchema {
    departingFlight: FlightSchema;
    returningFlight?: FlightSchema;
    timeToAirportA: number;
    timeToAirportB: number;
    flightPrice: number;
    totalDepTime: number;
    totalRetTime?: number;
    availSeats: number;
    uniqueCode: number;
    depTravelSegments: TravelSegmentSchema[];
    retTravelSegments?: TravelSegmentSchema[];
}

export interface ResultInfoSchema {
    airlines: string[];
    depAirports: string[];
    arrAirports: string[];
    minPrice?: number;
    maxPrice?: number;
    trips: TripSchema[];
}