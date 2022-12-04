export interface FlightSchema {
    airlines:string[];
    departureAirport:string;
    arrivalAirport:string;
    departureTime:string;
    arrivalTime:string;
    flightTime:number;
    numberOfStops:number;
    // price:number;
    segments: FlightSegmentSchema[];
    // timeToAirport:number;
    // timeFromAirport:number;
}

export interface FlightSegmentSchema {
    airline:string;
    depAirportCode:string;
    arrAirportCode:string;
    segmentDuration:number;
    departTime:string;
    arrivalTime:string;
}

export interface TravelSegmentSchema {
    travelDuration: number;
    travelType: string; // airline code, car, or transit
    waitTime: number;   // buffer time or layover time
    depTime: string;
    arrTime: string;
    depLocation: string;
    arrLocation: string;
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
    depTravelTimeline: TravelSegmentSchema[];
    retTravelTimeline: TravelSegmentSchema[];
}

export interface ResultInfoSchema {
    airlines: string[];
    depAirports: string[];
    arrAirports: string[];
    minPrice?: number;
    maxPrice?: number;
    trips: TripSchema[];
}