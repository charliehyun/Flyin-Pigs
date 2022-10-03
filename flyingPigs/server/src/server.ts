import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { mongoRouter } from "./routes"
// import { airportFinder } from "./findAirports"

// let a = new airportFinder();

// a.findAirportsInRange(40.465600640989585, -86.91021761350135, 12000, "DRIVE");

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());

        app.use("/airports", mongoRouter);
        // start the Express server
        app.listen(5200, () => {
            console.log(`Server running at http://localhost:5200...`);
        });

    })
    .catch(error => console.error(error));