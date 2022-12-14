const { MongoClient } = require("mongodb");
const url = "mongodb+srv://chyun:jLzG6yktlSoAvqDD@flyinpigs.9d1ukvz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
// The database to use
const dbName = "airports";

async function loadCoordinates() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        const airportDataCol = db.collection("airportDataTest");
        const coordsCol = db.collection("coordinatesTest");

        // let coords = [[],[],[]];

        // await airportDataCol.find().forEach(doc => {
        //     coords[0].push(doc.IATA);
        //     coords[1].push(doc.LAT);
        //     coords[2].push(doc.LNG);   
        // });
        // let allCoords = {
        //     "coords": coords
        // }         
        // const p = await coordsCol.insertOne(allCoords);

        let coords = [];

        await airportDataCol.find().forEach(doc => {
            let c = [];
            c.push(doc.IATA);
            c.push(doc.LAT);
            c.push(doc.LNG); 
            coords.push(c);  
        });
        let allCoords = {
            "coords": coords
        }         
        const p = await coordsCol.insertOne(allCoords);

    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

// loadCoordinates();
// updateDistanceToArray();
async function updateDistanceToArray() {
    var ops = [];
    const db = client.db(dbName);

    await db.collection("airportDataTest").find({ "Driving": { "$type": 2} }).forEach(doc => {
        var driving = doc.Driving.split(',');
        ops.push({
            "updateOne": {
            "filter": { "_id": doc._id },
            "update": { "$set": { "Driving": driving } }
            }
        });     
  
    });
    console.log(ops);
    db.collection("airportDataTest").bulkWrite(ops);
}

updateStringToNum();
async function updateStringToNum() {
    var ops = [];
    const db = client.db(dbName);

    await db.collection("airportDataTest").find({ "Transit": { "$type": 4} }).forEach(doc => {
        var transit = doc.Transit.map(element => parseInt(element));
        ops.push({
            "updateOne": {
            "filter": { "_id": doc._id },
            "update": { "$set": { "Transit": transit } }
            }
        });     
  
    });
    console.log(ops);
    db.collection("airportDataTest").bulkWrite(ops);
}