import mongoose from "mongoose";
var Airport = require("./airport");
var Coordinates = require("./coordinates");
import log4js from "log4js";

//this function will take in a starting address, a list of Airport objects with address field, airport code field,
//and a driving range in hours. From there, the algorithm will find a list of all the airport objects that are within
//the radius of the address for the inputted hours.
//global variables so we can have the appropriate
export class airportFinder {
    inRadiusAirportsIndices:{index: number; duration:number}[] = [];
    maxDriveTime:number;
    current25:number; //0 for the first 25 (indices 0-24), 1 for next 25 (indices 25-49), 2 for the next 25 (indices 50-74).
    logger:log4js.Logger;
    constructor() {
        this.maxDriveTime = 0;
        this.current25 = 0;
        this.logger = log4js.getLogger();
    }
    // this function finds the closest (reachable) airport from the starting location
    // and the time to that airport
    async findClosestAirport(startLat: number, startLng: number, travelMethod: string) {
        const {Client} = require("@googlemaps/google-maps-services-js");
        const client = new Client({});
        // let coords be an array of [iata, lat, lng, dist]
        let res = await Coordinates.findOne({});
        let coords = res["coords"];
        let startCoords = [{"lat": startLat, "lng": startLng}];
        let destCoords = [];

        for(let i = 0; i < coords.length; i++) {
            var a = coords[i][1] - startLat;
            var b = coords[i][2] - startLng;
            coords[i].push(Math.sqrt( a*a + b*b ));
        }

        coords.sort(this.sortOnDistances);

        // currently only checking the closest 25 euclidean distance airports to find closest reachable airport
        // edge case where all 25 closest euclidean distance are not reachable will fail 
        destCoords = coords.slice(0,25).map((element: any) => {return {"lat": element[1], "lng": element[2]}});

        // API call to determine drive(or others) time to closest airport
        let timeToClosestArpt = Number.MAX_VALUE;
        let cloestAirportIndex = -1;
        await client.distancematrix({
            params: {
                origins: startCoords,
                destinations: destCoords,
                mode: travelMethod,
                key: "AIzaSyA24p5rileUNbxSp8afoKXcwYH3zLlyxuU",
            },
        }).then((r: any) => {
            r.data.rows[0].elements.forEach(function (item:any, index:number) {
                if(item.hasOwnProperty("duration") && item["status"] == "OK" && item["duration"]["value"] < timeToClosestArpt){
                    timeToClosestArpt = item["duration"]["value"];
                    cloestAirportIndex = index;
                }
            });
        }).catch((e: any) => {
            console.log(e);
        })

        this.logger.info("closest reachable airport: ", coords[cloestAirportIndex][0]);
        this.logger.info("time to closest reachable airport: ", timeToClosestArpt);
        // this.logger.info("closest airport list", coords);
        return {"IATA": coords[cloestAirportIndex][0], "timeToClosestAirport": timeToClosestArpt};
    }

    // this function finds all the airports within the driving time + time to closest airport from
    // the closest airport
    async findAirportsInRange(startLat: number, startLng: number, driveTime: number, travelMethod: string) {
        console.log("pre filter");
        const {Client} = require("@googlemaps/google-maps-services-js");
        const client = new Client({});

        let closestAirport = await this.findClosestAirport(startLat, startLng, travelMethod);

        // the driving time array is stored where the 6 least significant digits
        // correspond to the IATA code 
        // e.x. 11880687278 will correspond to 11880 driving time to airport DHN
        // 68=D 72=H 78=N
        let validAirports: any[] = [];
        let res = await Airport.findOne({"IATA": closestAirport["IATA"]});
        let driveTimeArr: any[] = [];
        let startCoords = [{"lat": startLat, "lng": startLng}];
        // let closestAirportCoords = [{"lat": res["LAT"], "lng": res["LNG"]}];
        let timeToClosestArpt = closestAirport["timeToClosestAirport"];

        // TODO if coord is same as closest airport, set timeToClosestArpt to 0 and skip api call
        // check |x-y| < .1 or something instead of x == y.

        if(travelMethod == "driving") {
            driveTimeArr = res["Driving"];
        }
        else if(travelMethod == "transit") {
            driveTimeArr = res["Transit"];
        }

        // if closest airport is within driveTime, push to validAirports
        if(timeToClosestArpt <= driveTime) {
            console.log("valid airport");
            validAirports.push(res);
        } else {
            return [];
        }

        // let buffer be an additional overestimation 
        const buffer = 0;
        let adjustedDriveTime = (driveTime + timeToClosestArpt + buffer) * 1000000 + 1000000;
        let lastIndex = this.binarySearch(driveTimeArr, adjustedDriveTime, this.compareNumber);
        if(lastIndex < 0) {
            lastIndex = (lastIndex + 2) * -1;
        }
        
        driveTimeArr = driveTimeArr.slice(0, lastIndex + 1); 

        for(let i = 0; i < driveTimeArr.length; i++) {
            let decimal = (parseInt(driveTimeArr[i])) % 1000000;
            let iata = this.decodeAscii(decimal);
            let res = await Airport.findOne({"IATA": iata});
            validAirports.push(res);
        }
        //console.log("valid airports: ", validAirports);
        // this.logger.info("prefilter list: ", validAirports);
        return validAirports;
    }

    async findAirports(startLat: number, startLng: number, airportsToSort: any[],
                         driveTime: number, travelMethod: string) {
        console.log("filter");
        //initialize all my global vars.
        //this.maxDriveTime = driveTime * 3600; //get max drive time in seconds.
        this.maxDriveTime = driveTime;
        this.current25 = 0;
        this.inRadiusAirportsIndices = [];
        const {Client} = require("@googlemaps/google-maps-services-js");

        const client = new Client({});

        //starting location
        let startArr = [];
        let start = [startLat, startLng];
        startArr.push(start);
        //make calls to the api 25 at a time.
        let index:number = 0;
        while(index < airportsToSort.length) {
            var distanceMatrixCall: any[] = new Array(25);
            //split the Airports to search into groups of 25.
            for (let i = 0; i < 25; i++) {
                if (index < airportsToSort.length) {
                    //add our latLngCodes to the distanceMatrixCalls
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
        let newArray: any[] = [];
        this.inRadiusAirportsIndices.forEach(function (item:any, index:number) {
            let tempAirport = airportsToSort[item["index"]];
            tempAirport["TravelTime"] = item["duration"]
            newArray.push(tempAirport);
        });
        // let newArray = this.inRadiusAirportsIndices.map(x => airportsToSort[x["index"]]);
        //console.log("new array", newArray);
        // this.logger.info("airports in range: ", newArray);
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
                    let durationInt = parseInt(element.duration.value);
                    if (durationInt <= this.maxDriveTime)
                    {
                        this.inRadiusAirportsIndices.push({index: indexBase + j, duration: durationInt});
                    }
                }
                else
                {
                    this.logger.warn("Airport is not reachable");
                }
            }
        }
        this.current25++;
    }

    decodeAscii(decimal: number) {
        let a = Math.floor(decimal / 10000);
        let b = Math.floor(decimal % 10000 / 100);
        let c = Math.floor(decimal % 10000 % 100);
        
        let iata = String.fromCharCode(a,b,c);
        return iata;
    }
    sortOnDistances(a: number[], b: number[]) {
        if (a[3] === b[3]) {
            return 0;
        }
        else {
            return (a[3] < b[3]) ? -1 : 1;
        }
    }
    binarySearch(ar: any[], el: any, compare_fn: (arg0: any, arg1: any) => any) {
        var m = 0;
        var n = ar.length - 1;
        while (m <= n) {
            var k = (n + m) >> 1;
            var cmp = compare_fn(el, ar[k]);
            if (cmp > 0) {
                m = k + 1;
            } else if(cmp < 0) {
                n = k - 1;
            } else {
                return k;
            }
        }
        return -m - 1;
    }
    compareNumber(a: number, b: number) {
        return a - b;
    }

}
