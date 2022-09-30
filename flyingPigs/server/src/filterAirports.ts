import mongoose from "mongoose";

export class airportFinder {
    inRadiusAirportsIndices:number[] = [];
    maxDriveTime:number;
    constructor() {
        this.maxDriveTime = 0;
    }
    // this function finds the closest airport to the starting location
    async findClosestAirport(startLat: number, startLong: number) {

    }
    // this function finds all the airports within the driving time + time to closest airport from
    // the closest airport
    async findAirportsInRange(closestAirport: string, driveTime: number, travelMethod: string) {

    }
}
