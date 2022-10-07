import * as mongodb from "mongodb";

export interface AirportSchema {
    Address:string;
    Airport:string;
    Country:string;
    Enplanement:string;
    FAA:string;
    IATA:string;
    ICAO:string;
    LAT:number;
    LNG:number;
    Role:string;
    State:string;
    City:string;
    Driving:string[];
    Transit:string[];
    _id?: mongodb.ObjectId;
}