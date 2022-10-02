// import mongoose from "mongoose";
// import test from "node:test";
// var Airport = require("./airport");
// var Coordinates = require("./coordinates");

// export class airportFinder {
//     inRadiusAirportsIndices:number[] = [];
//     maxDriveTime:number;
//     constructor() {
//         this.maxDriveTime = 0;
//     }
//     // this function finds the closest airport to the starting location
//     async findClosestAirport(startLat: number, startLng: number) {
//         // let coords[0] = iata, coords[1] = lats, coords[2] = lng, and coords[3] = distances
//         // let coords: any[] = [[],[],[],[]];
//         let res = await Coordinates.findOne({});
//         let coords = res["coords"];
//         // coords[0] = res["coords"][0];
//         // coords[1] = res["coords"][1];
//         // coords[2] = res["coords"][2];

//         // for(let i = 0; i < coords[0].length; i++) {
//         for(let i = 0; i < coords.length; i++) {
//             // var a = coords[1][i] - startLat;
//             // var b = coords[2][i] - startLng;
//             // coords[3][i] = Math.sqrt( a*a + b*b );
//             var a = coords[i][1] - startLat;
//             var b = coords[i][2] - startLng;
//             coords[i].push(Math.sqrt( a*a + b*b ));
//         }
//         // console.log("presort: ", coords);

//         coords.sort(this.sortOnDistances);

//         // console.log("postsort: ", coords);
//         // console.log("closest: ", coords[0][0]);
//         return coords[0][0];
//     }
//     // this function finds all the airports within the driving time + time to closest airport from
//     // the closest airport
//     async findAirportsInRange(startLat: number, startLng: number, driveTime: number, travelMethod: string) {
//         const {Client} = require("@googlemaps/google-maps-services-js");
//         const client = new Client({});

//         let closestAirport = await this.findClosestAirport(startLat, startLng);

//         // the driving time array is stored where the 6 least significant digits
//         // correspond to the IATA code 
//         // e.x. 11880687278 will correspond to 11880 driving time to airport DHN
//         // 68=D 72=H 78=N

//         let res = await Airport.findOne({"IATA": closestAirport});
//         let driveTimeArr: any[] = [];
//         let startCoords = [{"lat": startLat, "lng": startLng}];
//         let closestAirportCoords = [{"lat": res["LAT"], "lng": res["LNG"]}];
//         let timeToClosestArpt = 0;

//         if(travelMethod == "DRIVE") {
//             driveTimeArr = res["Driving"];
//             // API call to determine drive(or others) time to closest airport
//             timeToClosestArpt = Number.MAX_VALUE;

//             await client.distancematrix({
//                 params: {
//                     origins: startCoords,
//                     destinations: closestAirportCoords,
//                     mode: travelMethod,
//                     key: "AIzaSyA24p5rileUNbxSp8afoKXcwYH3zLlyxuU",
//                 },
//             }).then((r: any) => {
//                 timeToClosestArpt = r.data.rows[0].elements[0].duration.value;
//             }).catch((e: any) => {
//                 console.log(e);
//             })
//         }

//         // let buffer be an additional overestimation 
//         const buffer = 0;
//         let adjustedDriveTime = (driveTime + timeToClosestArpt + buffer) * 1000000 + 1000000;
//         let lastIndex = this.binarySearch(driveTimeArr, adjustedDriveTime, this.compareNumber);
//         if(lastIndex < 0) {
//             lastIndex = (lastIndex + 2) * -1;
//         }
        
//         let validAirports: any[] = [];
//         driveTimeArr = driveTimeArr.slice(0, lastIndex + 1); 
        
//         // await driveTimeArr.forEach(async function(arpt, index) { 
//         //     let decimal = (parseInt(arpt)) % 1000000;
//         //     // console.log(decimal);
//         //     // console.log(iata);
//         //     // TODO: for some reason calling decodeAscii doesn't work.
//         //     // Figure out why if time allows
//         //     // let iata = this.decodeAscii(decimal);

//         //     let a = Math.floor(decimal / 10000);
//         //     let b = Math.floor(decimal % 10000 / 100);
//         //     let c = Math.floor(decimal % 10000 % 100);
            
//         //     let iata = String.fromCharCode(a,b,c);
//         //     let res = await Airport.findOne({"IATA": iata});
//         //     validAirports.push(res);
//         // });
//         for(let i = 0; i < driveTimeArr.length; i++) {
//             let decimal = (parseInt(driveTimeArr[i])) % 1000000;

//             // let a = Math.floor(decimal / 10000);
//             // let b = Math.floor(decimal % 10000 / 100);
//             // let c = Math.floor(decimal % 10000 % 100);
            
//             // let iata = String.fromCharCode(a,b,c);
//             let iata = this.decodeAscii(decimal);

//             let res = await Airport.findOne({"IATA": iata});
//             validAirports.push(res);
//         }
//         return validAirports;
//     }

//     decodeAscii(decimal: number) {
//         let a = Math.floor(decimal / 10000);
//         let b = Math.floor(decimal % 10000 / 100);
//         let c = Math.floor(decimal % 10000 % 100);
        
//         let iata = String.fromCharCode(a,b,c);
//         return iata;
//     }
//     sortOnDistances(a: number[], b: number[]) {
//         if (a[3] === b[3]) {
//             return 0;
//         }
//         else {
//             return (a[3] < b[3]) ? -1 : 1;
//         }
//     }
//     binarySearch(ar: any[], el: any, compare_fn: (arg0: any, arg1: any) => any) {
//         var m = 0;
//         var n = ar.length - 1;
//         while (m <= n) {
//             var k = (n + m) >> 1;
//             var cmp = compare_fn(el, ar[k]);
//             if (cmp > 0) {
//                 m = k + 1;
//             } else if(cmp < 0) {
//                 n = k - 1;
//             } else {
//                 return k;
//             }
//         }
//         return -m - 1;
//     }
//     compareNumber(a: number, b: number) {
//         return a - b;
//     }

    
// }
