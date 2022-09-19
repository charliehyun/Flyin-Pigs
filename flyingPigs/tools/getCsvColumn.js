const util = require('util')

var fs = require('fs');
var csv = require('csv-parser');


var columnToRetrieve = "Address";
const addresses = [];

fs.createReadStream('airportData.csv')
  .pipe(csv())
  .on('data', (data) => addresses.push(data[columnToRetrieve]))
  .on('end', () => {
    //console.log(addresses);
    console.log(util.inspect(addresses, { maxArrayLength: null }))
});

