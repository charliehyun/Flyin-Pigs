import { write } from "node:fs";
import test from "node:test";

const util = require('util')
var fs = require('fs');
var csv = require('csv-parser');
const {Client} = require("@googlemaps/google-maps-services-js");

initialize();
// getDistanceMatrix();
writeToCSV();

const distanceMatrix: any[][] = [[]];

async function initialize() {
    // const airports:any = await getColumn("IATA");
    let airports:any = await getColumn("IATA");

    /*
    TESTING
    */
    // airports = airports.slice(0, 3);
    /*
    END TESTING
    */
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
        var read_stream = fs.createReadStream('./airportDistances.csv').pipe(csv());
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
    let airports:any = await getColumn("IATA");
    let lat:any = await getColumn("LAT");
    let lng:any = await getColumn("LNG");
    const locations:{"lat": number,"lng": number}[] = [];
    /*
    TESTING
    */
    // let airports:any = await getColumn("IATA");
    // let lat:any = await getColumn("LAT");
    // let lng:any = await getColumn("LNG");
    // airports = airports.slice(0, 3);
    // lat = lat.slice(0, 3);
    // lng = lng.slice(0, 3);
    /*
    END TESTING
    */
    lat.forEach(function(l, index){
        let coords = {"lat": lat[index], "lng": lng[index]};
        locations.push(coords);
    });

    // since the distance matrix can return 100 elements at once
    for (let i = 0; i < locations.length; i+=10) {
        let lastIndexS = i + 10 > locations.length? locations.length : i + 10;
        for (let j = 0; j < locations.length; j+=10) {
            let lastIndexE = j + 10 > locations.length? locations.length : j + 10;
            const client = new Client({});
            const originArray = locations.slice(i, lastIndexS);
            // const originArray = ["Indiana"];
            const destinationArray = locations.slice(j, lastIndexE);
            // console.log("start and end: ", i, lastIndexS, j, lastIndexE);
            // console.log("INPUTS!!!: ", originArray, destinationArray);
            await client.distancematrix({
                params: {
                    origins: originArray,
                    destinations: destinationArray,
                    mode: 'transit',
                    key: "AIzaSyDkza414g1-f7ry3P5mInUEJrFv9iDk1O0",
                },
            })
            .then((r: any) => {   
                let origins = r.data.origin_addresses;
                for(let k = 0; k < origins.length; k++) {
                    let x = i + k + 1;
                    let results = r.data.rows[k].elements;
                    for(let l = 0; l < results.length; l++) {
                        let y = j + l + 1;
                        // console.log("x, y: " + x + ", " + y);
                        var element = results[l];
                        var duration = 100000000;
                        if(element.status != 'ZERO_RESULTS') {
                            duration = element.duration.value;
                        }
                        distanceMatrix[x][y] = duration;
                    }

                }   
            })
            .catch((e: any) => {
                console.log(e);
            })
            .finally(() => {
                // console.log(util.inspect(distanceMatrix, { maxArrayLength: null }))
            });            
        }
    }
}

async function writeToCSV() {
    await getDistanceMatrix();

    let data = "";
    let output = "";
    try {
        data = fs.readFileSync('./airportDistances.csv', 'utf8');
        // console.log(data);
    } catch (err) {
        console.error(err);
    }
    const lines = data.split("\n"); 
    output = output + lines[0] + ",Transit\r\n";
    // console.log(lines.length);
    // lines.length - 1 because new line
    for(let i = 1; i < lines.length - 1; i++) {
        let formatted = formatArpt(distanceMatrix[i])
        output = output + lines[i] + "," + formatted + "\r\n";
    }
    console.log(output);
    // console.log(util.inspect(distanceMatrix, { maxArrayLength: null }));
}

function formatArpt(row) {
    // console.log("row: ",row);
    for(let i = 1; i < row.length; i++) {
        if(row[i] == 0) {
            continue;
        }
        row[i] = row[i] * 1000000 + iataToDecimal(distanceMatrix[0][i]);
    }
    // get rid of IATA code
    row.splice(0,1);
    // sort
    row.sort(function(a, b){return a - b}); 
    // get rid of self airport
    row.splice(0,1);
    // console.log(row);
    return "\"" + row + "\"";
}

function iataToDecimal(iata) {
    return iata.charCodeAt(0) * 10000 + iata.charCodeAt(1) * 100 + iata.charCodeAt(2);
}