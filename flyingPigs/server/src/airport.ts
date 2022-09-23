import { ObjectId } from "mongodb";
import {AirportSchema} from "./airportSchema";

export class Airport implements AirportSchema {
    private _City: string;
    private _FAA: string;
    private _IATA: string;
    private _ICAO: string;
    private _Airport: string;
    private _Role: string;
    private _Enplanements: number;
    private _Country: string;
    private _State: string;
    private _Longitude: number;
    private _Latitude: number;


    constructor(City: string, FAA: string, IATA: string, ICAO: string, Airport: string, Role: string, Enplanements: number, Country: string, State: string, Longitude: number, Latitude: number) {
        this._City = City;
        this._FAA = FAA;
        this._IATA = IATA;
        this._ICAO = ICAO;
        this._Airport = Airport;
        this._Role = Role;
        this._Enplanements = Enplanements;
        this._Country = Country;
        this._State = State;
        this._Longitude = Longitude;
        this._Latitude = Latitude;
    }

    Address: string;
    Enplanement: string;
    LAT: number;
    LNG: number;
    _id?: ObjectId;

    get City(): string {
        return this._City;
    }

    set City(value: string) {
        this._City = value;
    }

    get FAA(): string {
        return this._FAA;
    }

    set FAA(value: string) {
        this._FAA = value;
    }

    get Longitude(): number {
        return this._Longitude;
    }

    set Longitude(value: number) {
        this._Longitude = value;
    }

    get Latitude(): number {
        return this._Latitude;
    }

    set Latitude(value: number) {
        this._Latitude = value;
    }

    get IATA(): string {
        return this._IATA;
    }

    set IATA(value: string) {
        this._IATA = value;
    }

    get ICAO(): string {
        return this._ICAO;
    }

    set ICAO(value: string) {
        this._ICAO = value;
    }

    get Airport(): string {
        return this._Airport;
    }

    set Airport(value: string) {
        this._Airport = value;
    }

    get Role(): string {
        return this._Role;
    }

    set Role(value: string) {
        this._Role = value;
    }

    get Enplanements(): number {
        return this._Enplanements;
    }

    set Enplanements(value: number) {
        this._Enplanements = value;
    }

    get Country(): string {
        return this._Country;
    }

    set Country(value: string) {
        this._Country = value;
    }

    get State(): string {
        return this._State;
    }

    set State(value: string) {
        this._State = value;
    }
}