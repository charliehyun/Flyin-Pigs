import * as mongodb from "mongodb";

const mongoose = require('mongoose');

const credentialsSchema = mongoose.Schema({
    email:{type: String, required:true},
    password:{type: String, required:true},
    resetPasswordToken:{type: String, required:false},
    resetPasswordExpires:{type: String, required:false},
    _id: {type: mongoose.Schema.Types.ObjectId, required:false}
}, {
    collection: 'credentials'
});

module.exports = mongoose.model('Credentials', credentialsSchema);