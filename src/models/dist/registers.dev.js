"use strict";

var mongoose = require('mongoose');

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var customerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmpassword: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}); // generating token

customerSchema.methods.generateAuthToken = function _callee() {
  var token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log(this._id);
          token = jwt.sign({
            _id: this._id.toString()
          }, process.env.SECRET_KEY);
          this.tokens = this.tokens.concat({
            token: token
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(this.save());

        case 6:
          return _context.abrupt("return", token);

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.send("the error part  " + _context.t0);
          console.log("the error part" + _context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[0, 9]]);
}; // bcrypt passwordHash secure]


customerSchema.pre("save", function _callee2(next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!this.isModified("password")) {
            _context2.next = 7;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 10));

        case 3:
          this.password = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 10));

        case 6:
          this.confirmpassword = _context2.sent;

        case 7:
          next();

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
}); // now we create to a Collection

var Register = new mongoose.model("Register", customerSchema);
module.exports = Register;