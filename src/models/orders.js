const mongoose = require('mongoose');
// const jwt = require("jsonwebtoken");
const opts = { toJSON: { virtuals: true } };
const DeviceSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    model: {
      type: String,
    },
    message: {
      type: String,
    },

    totalPrice: {
      type: String,
    },
    screen: {
      type: String,
    },

    products: [{}],
    mode: {
      type: String,
      required: true,
    },

    number: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    orderOtp: {
      type: String,
      required: true,
    },

    State: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    Address: {
      type: String,
      required: true,
    },

    date: {
      type: String,
    },
    expiredate: {
      type: String,
    },
    paymentid: {
      type: String,
    },
    orderid: {
      type: String,
    },
  },
  opts
);


// now we create to a Collection
 const Device = new mongoose.model("Device", DeviceSchema);

module.exports = Device;