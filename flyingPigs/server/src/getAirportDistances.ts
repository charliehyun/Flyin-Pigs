const util = require('util')
var fs = require('fs');
var csv = require('csv-parser');


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
    const airports = await getColumn("IATA");
    const lat:any = await getColumn("LAT");
    const lng:any = await getColumn("LNG");
    const startLocation:google.maps.LatLng[] = [];
    const endLocation:google.maps.LatLng[] = [];

    lat.forEach(function(l, index){
        let coords = new google.maps.LatLng(lat[index], lng[index]);
        startLocation.push(coords);
        endLocation.push(coords);
    });

    // since the distance matrix can take in 25 locations at once

    for (let i = 0; i < startLocation.length; i+=25) {
        let lastIndexS = i + 24 > startLocation.length ? startLocation.length : i + 24;
        for (let j = 0; j < endLocation.length; j+=25) {
            let lastIndexE = i + 24 > endLocation.length ? endLocation.length : i + 24;
        }
    }

}

getDistanceMatrix();