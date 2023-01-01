"use strict";

var mongoose = require('mongoose'); // personal detailes  schema


var PersonalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  selectCountry: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  }
}); // now we create to a Collection

var Personal = new mongoose.model("Personal", PersonalSchema);
module.exports = Personal;