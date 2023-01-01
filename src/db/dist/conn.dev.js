"use strict";

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/realback", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(function () {
  console.log("connection successful");
})["catch"](function (e) {
  console.log("no connection ");
});