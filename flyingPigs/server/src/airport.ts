import * as mongodb from "mongodb";

const mongoose = require('mongoose');

const airportSchema = mongoose.Schema({
    Address:{type: String, required:true},
    Airport:{type: String, required:true},
    Country:{type: String, required:true},
    Enplanement:{type: String, required:true},
    FAA:{type: String, required:true},
    IATA:{type: String, required:true},
    ICAO:{type: String, required:true},
    LAT:{type: Number, required:true},
    LNG:{type: Number, required:true},
    Role:{type: String, required:true},
    State:{type: String, required:true},
    City:{type: String, required:true},
    Driving:{type: Array, required:true},
    Transit:{type: Array, required:true},
    TravelTime:{type: Number, required:false},
    _id: {type: mongoose.Schema.Types.ObjectId, required:false}
}, {
    collection: 'airportDataTest'
});

module.exports = mongoose.model('Airport', airportSchema);