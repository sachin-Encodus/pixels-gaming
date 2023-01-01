"use strict";

var mongoose = require('mongoose');

var jwt = require("jsonwebtoken");

var DeviceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  message: {
    type: String
  },
  total: {
    type: String
  },
  mobile: [String],
  laptop: [String],
  airpods: [String],
  smartwatch: [String],
  smarttv: [String],
  drones: [String]
}); // now we create to a Collection

var Device = new mongoose.model("Device", DeviceSchema);
module.exports = Device;