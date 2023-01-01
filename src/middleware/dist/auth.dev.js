"use strict";

var jwt = require("jsonwebtoken");

var Register = require("../models/registers");

var auth = function auth(req, res, next) {
  var token, verifyUser, user;
  return regeneratorRuntime.async(function auth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // verifyUser for authentication any pages
          token = req.cookies.jwt;
          verifyUser = jwt.verify(token, process.env.SECRET_KEY);
          console.log(verifyUser); // verifyUser for get data any pages

          _context.next = 6;
          return regeneratorRuntime.awrap(Register.findOne({
            _id: verifyUser._id
          }));

        case 6:
          user = _context.sent;
          console.log(user.firstname);
          req.token = token;
          req.user = user;
          next();
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          res.status(400).render('signup');

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = auth;