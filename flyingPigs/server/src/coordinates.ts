import * as mongodb from "mongodb";

const mongoose = require('mongoose');

const coordinatesSchema = mongoose.Schema({
    coords:{type: Array, required:true},
    _id: {type: mongoose.Schema.Types.ObjectId, required:false}
}, {
    collection: 'coordinatesTest'
});

module.exports = mongoose.model('Coordinates', coordinatesSchema);