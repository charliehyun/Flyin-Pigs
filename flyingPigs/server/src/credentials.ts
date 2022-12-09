import * as mongodb from "mongodb";

const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const credentialsSchema = mongoose.Schema({
    email:{type: String, required:true},
    password:{type: String, required:true},
    resetPasswordToken:{type: String, required:false},
    resetPasswordExpires:{type: Number, required:false},
    address:{type: String, required:false},
    trackedSearches:{type: [Object], required:false},
    _id: {type: mongoose.Schema.Types.ObjectId, required:false}
}, {
    collection: 'credentials'
});

credentialsSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    // address: this.address,
    exp: expiry.getTime() / 1000,
  }, process.env.MY_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('Credentials', credentialsSchema);