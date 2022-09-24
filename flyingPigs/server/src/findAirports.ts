import mongoose from "mongoose";

const Airport = require('./airport');
//this function will take in a starting address, a list of Airport objects with address field, airport code field,
//and a driving range in hours. From there, the algorithm will find a list of all the airport objects that are within
//the radius of the address for the inputted hours.

//global variables so we can have the appropriate
var AirportModel = mongoose.model('Airport');
var inRadiusAirportsIndices:number[] = [];
var maxDriveTime = 0;
var current25 = 0; //0 for the first 25 (indices 0-24), 1 for next 25 (indices 25-49), 2 for the next 25 (indices 50-74).
function findAirport(startLat: number, startLong: number, airportsToSort: any[],
                     driveTime: number, travelMethod: string) : any[] {
    //initialize all my global vars.
    maxDriveTime = driveTime;
    current25 = 0;

    let service = new google.maps.DistanceMatrixService();
    //starting location
    let startLocation:google.maps.LatLng[] = []
    let start = new google.maps.LatLng(startLat, startLong);
    startLocation.push(start);

    //make calls to the api 25 at a time.
    let index:number = 0;
    while(index < airportsToSort.length) {
        var distanceMatrixCall: google.maps.LatLng[]   = new Array(25);
        //split the Airports to search into groups of 25.
        for (let i = 0; i < 25; i++) {
            if (index < airportsToSort.length) {
                //add our latLongCodes to the distanceMatrixCalls
                var airport = airportsToSort[index];
                var newLatLongCode:google.maps.LatLng = new google.maps.LatLng(airport.Latitude, airport.Longitude);
                distanceMatrixCall[i] = newLatLongCode;
            } else {
                //cuts off if there aren't 25 exactly left.
                break;
            }
        }
        //call the matrix call into the callback function
        service.getDistanceMatrix({
            origins: startLocation,
            destinations: distanceMatrixCall,
            travelMode: google.maps.TravelMode['DRIVING']
        }, callback);
    }
    return inRadiusAirportsIndices.map(index => airportsToSort[index]);
}

function callback(response:any, status:any) {
    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                var duration = element.duration.text;
                var from = origins[i];
                var to = destinations[j];

                var indexBase = current25 * 25;
                if (duration < maxDriveTime)
                {
                    inRadiusAirportsIndices.push(indexBase + j);
                }
            }
        }
        current25++;
    }
}
