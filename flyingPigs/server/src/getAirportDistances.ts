const util = require('util')
var fs = require('fs');
var csv = require('csv-parser');
const {Client} = require("@googlemaps/google-maps-services-js");

const distanceMatrix: string[][] = [[]];
var outerIteration = 0;
var innerIteration = 0;
var maxIterations = -1;

async function initialize() {
    // const airports:any = await getColumn("IATA");
    /*
    TESTING
    */
    let airports:any = await getColumn("IATA");
    airports = airports.slice(7, 9);
    /*
    END TESTING
    */
    maxIterations = Math.ceil(airports / 25);
    for(var i = 0; i < airports.length  + 1; i++) {
        distanceMatrix[i] = [];
    }
    distanceMatrix[0][0] = "NONE"
    for(var i = 0; i < airports.length; i++) {
        distanceMatrix[0][i + 1] = airports[i];
            distanceMatrix[i + 1][0] = airports[i];
    }
}

function getColumn(columnToRetrieve: string) {
    return new Promise((resolve, reject) => {
        const col: string[] = [];
        var read_stream = fs.createReadStream('../../tools/airportData.csv')
        .pipe(csv());
        read_stream.on('data', (data: { [x: string]: string; }) => col.push(data[columnToRetrieve]))
        read_stream.on('error', e => {
            reject(e);
        });
        return read_stream.on('end', function () {
            resolve(col);
        });
    });
}

async function getDistanceMatrix() {
    
    // const airports:any = await getColumn("IATA");
    // const lat:any = await getColumn("LAT");
    // const lng:any = await getColumn("LNG");
    
    const locations:{"lat": number,"lng": number}[] = [];
    /*
    TESTING
    */
    let airports:any = await getColumn("IATA");
    let lat:any = await getColumn("LAT");
    let lng:any = await getColumn("LNG");
    airports = airports.slice(7, 9);
    lat = lat.slice(7, 9);
    lng = lng.slice(7, 9);
    /*
    END TESTING
    */
    lat.forEach(function(l, index){
        let coords = {"lat": lat[index], "lng": lng[index]};
        locations.push(coords);
    });

    // since the distance matrix can take in 25 locations at once
    for (let i = 0; i < locations.length; i+=25) {
        innerIteration = 0;
        let lastIndexS = i + 24 > locations.length ? locations.length : i + 24;
        for (let j = 0; j < locations.length; j+=25) {
            let lastIndexE = i + 24 > locations.length ? locations.length : i + 24;
            const client = new Client({});
            const originArray = locations.slice(i, lastIndexS + 1);
            const destinationArray = locations.slice(j, lastIndexE + 1);
            console.log(originArray);
            console.log(destinationArray);
            client.distancematrix({
                params: {
                    origins: originArray,
                    destinations: destinationArray,
                    travelMode: ['DRIVING'],
                    key: "AIzaSyDNunfk3fqSjOs1DerP1HkA_R5jA87N7ZY",
                },
            })
            .then((r: any) => {                
                var origins = r.data.origin_addresses;
                console.log(origins);
                for (var i = 0; i < origins.length; i++) {
                    var x = outerIteration * 25 + i + 1;
                    var results = r.data.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var y = innerIteration * 25 + j + 1;
                        console.log("x, y: " + x + ", " + y);
                        var element = results[j];
                        var duration = element.duration.value;
                        distanceMatrix[x][y] = duration;
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
            })
            .finally(() => {
                console.log(util.inspect(distanceMatrix, { maxArrayLength: null }))
                innerIteration++;
                if(innerIteration == maxIterations) {
                    outerIteration++;
                }
            });           
        }
    }
}

// function callback(response:any, status:any) {
//     if (status == 'OK') {
//         var origins = response.origin_addresses;
    
//         for (var i = 0; i < origins.length; i++) {
//           var results = response.rows[i].elements;
//           for (var j = 0; j < results.length; j++) {
//             var element = results[j];
//             var duration = element.duration.value;
//             console.log(duration);
//           }
//         }
//     }
// }


initialize();
getDistanceMatrix();
