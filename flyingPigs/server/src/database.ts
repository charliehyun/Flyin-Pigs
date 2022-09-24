import * as mongodb from "mongodb";
import { AirportSchema } from "./airportSchema";

export const collections: {
    //airports?: mongodb.Collection<AirportSchema>;
} = {};

export async function connectToDatabase(uri: string) {
    //const client = new mongodb.MongoClient(uri);
    //await client.connect();
    const mongoose = require('mongoose');
    const res = await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true});
    const {db} = mongoose.connection;


    //const db = client.db("airports");
    //await applySchemaValidation(db); no schema validation so far because that would be a pain to write.

    const airportCollection = await db.collection("airportData").find().toArray();
    //collections.airports = airportCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                    minLength: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
                    enum: ["junior", "mid", "senior"],
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("employees", {validator: jsonSchema});
        }
    });
}