import mongoose from "mongoose";

//this function will take in a starting address, a list of Airport objects with address field, airport code field,
//and a driving range in hours. From there, the algorithm will find a list of all the airport objects that are within
//the radius of the address for the inputted hours.
//global variables so we can have the appropriate
export class airportFinder {
    inRadiusAirportsIndices:number[] = [];
    maxDriveTime:number;
    current25:number; //0 for the first 25 (indices 0-24), 1 for next 25 (indices 25-49), 2 for the next 25 (indices 50-74).
    constructor() {
        this.maxDriveTime = 0;
        this.current25 = 0;

    }
    async findAirport(startLat: number, startLong: number, airportsToSort: any[],
                         driveTime: number, travelMethod: string) {
        //initialize all my global vars.
        this.maxDriveTime = driveTime * 3600; //get max drive time in seconds.
        this.current25 = 0;
        this.inRadiusAirportsIndices = [];
        const {Client} = require("@googlemaps/google-maps-services-js");

        const client = new Client({});

        //starting location
        let startArr = [];
        let start = [startLat, startLong];
        startArr.push(start);
        //make calls to the api 25 at a time.
        let index:number = 0;
        while(index < airportsToSort.length) {
            var distanceMatrixCall: any[] = new Array(25);
            //split the Airports to search into groups of 25.
            for (let i = 0; i < 25; i++) {
                if (index < airportsToSort.length) {
                    //add our latLongCodes to the distanceMatrixCalls
                    var airport = airportsToSort[index];
                    distanceMatrixCall[i] = [airport.LAT, airport.LNG];
                    index++;
                } else {
                    //cuts off if there aren't 25 exactly left.
                    break;
                }
            }
            //call the matrix call into the callback function
            await client.distancematrix({
                params: {
                    origins: startArr,
                    destinations: distanceMatrixCall,
                    mode: travelMethod,
                    key: "AIzaSyA24p5rileUNbxSp8afoKXcwYH3zLlyxuU",
                },
            }).then((r: any) => {
                this.filterFunc(r);
            }).catch((e: any) => {
                console.log(e);
            })
        }
        let newArray = this.inRadiusAirportsIndices.map(x => airportsToSort[x]);
        return newArray;
    }

    filterFunc(response:any) {
            var origins = response.data.origin_addresses;
            var destinations = response.data.destination_addresses;
            for (var i = 0; i < origins.length; i++) {
                var results = response.data.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    if (element.status === 'OK')
                    {
                        var distance = element.distance.text;
                        var duration = element.duration.text;
                        var from = origins[i];
                        var to = destinations[j];
                        var indexBase = this.current25 * 25;
                        console.log(element.duration.value + " " + indexBase);
                        let durationInt = parseInt(element.duration.value);
                        if (durationInt <= this.maxDriveTime)
                        {
                            this.inRadiusAirportsIndices.push(indexBase + j);
                        }
                    }
                    else
                    {
                        console.log("airport is unreachable.");
                    }
                }
            }
            this.current25++;
    }

}
