const util = require('util')
var fs = require('fs');
var csv = require('csv-parser');
var Client = require("@googlemaps/google-maps-services-js").Client;


function getAddresses(columnToRetrieve) {
    const addresses = [];
    fs.createReadStream('airportData.csv')
    .pipe(csv())
    .on('data', (data) => addresses.push(data[columnToRetrieve]))
    .on('end', () => {
        getCoords(addresses)
    });
}
// function getCoords(addresses) {
//     var client = new Client({});
//     const lat = [];
//     const lng = [];

//     for (const addy of addresses) {
//         console.log(addy);
//         client
//             .geocode({
//             params: {
//                 address: addy,
//                 key: "AIzaSyDNunfk3fqSjOs1DerP1HkA_R5jA87N7ZY"
//             },
//             timeout: 1000
//         }).then(function (r) {
//             lat.push(r.data.results[0].geometry.location.lat);
//             lng.push(r.data.results[0].geometry.location.lng);
//             console.log(lat.length);
//         }).catch(function (e) {
//             lat.push("ERROR");
//             lng.push("ERROR");
//         });
//     }
//     while(lat.length != 396 || lng.length != 396) {
//         // console.log(lat.length);
//         continue;
//         sleep(1);
//     }
//     console.log("LAT");
//     console.log(util.inspect(lat, { maxArrayLength: null }))
//     console.log();
//     console.log("LNG");
//     console.log(util.inspect(lng, { maxArrayLength: null }))
// }

// getAddresses("Address");

const lat = new Array(396).fill("NONE");
const lng = new Array(396).fill("NONE");
function getCoords(addresses) {
    var client = new Client({});

    addresses.forEach(function(addy, index){
        client.geocode({
            params: {
                address: addy,
                key: "AIzaSyDNunfk3fqSjOs1DerP1HkA_R5jA87N7ZY"
            },
            timeout: 10000
        }).then(function (r) {
            // lat.push(r.data.results[0].geometry.location.lat);
            // lng.push(r.data.results[0].geometry.location.lng);
            lat.splice(index, 1, r.data.results[0].geometry.location.lat);
            lng.splice(index, 1, r.data.results[0].geometry.location.lng);
        }).catch(function (e) {
            // lat.push("ERROR");
            // lng.push("ERROR");
            lat.splice(index, 1, "ERROR");
            lng.splice(index, 1, "ERROR");
        });
    });
}

getAddresses("Address");
// setTimeout(() => { console.log(util.inspect(lat, { maxArrayLength: null })) }, 5000);
// setTimeout(() => { console.log(util.inspect(lng, { maxArrayLength: null })) }, 5000);
// TODO somebody pls figure out how to wait wait for google geocode to finish instead of just timeout by 5000 :) 
setTimeout(() => { printCoordsLineByLine() }, 5000);

function printCoordsLineByLine() {
    console.log("LAT");
    for(const l of lat) {
        console.log(l);
    }
    console.log();
    console.log();
    console.log("LNG");
    for(const l of lng) {
        console.log(l);
    }
}
