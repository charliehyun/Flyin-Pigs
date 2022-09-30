const { MongoClient } = require("mongodb");

 

// Replace the following with your Atlas connection string                                                                                                                                        

const url = "mongodb+srv://chyun:jLzG6yktlSoAvqDD@flyinpigs.9d1ukvz.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

 // The database to use

 const dbName = "airports";      

 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);
         const colA = db.collection("airportDataTest");
         const colB = db.collection("coordinates");
        //  let personDocument = {
        //      "airports": [ "Turing machine", "Turing test", "Turingery" ]
        //  }
         
         // Insert a single document, wait for promise so we can read it back
        //  const p = await col.insertOne(personDocument);
         // Find one document
        //  const myDoc = await col.findOne();
         // Print to the console
        //  console.log(myDoc);
        const all = await colA.find();
        console.log(all);
        } catch (err) {
         console.log(err.stack);
     }
     finally {
        await client.close();
    }
}

// run().catch(console.dir);
updateDistanceToArray();
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