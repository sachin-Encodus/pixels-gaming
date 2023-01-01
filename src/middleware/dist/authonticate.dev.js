"use strict";

var Register = require("../models/registers");

var Device = require("../models/orders");

var auth = function auth(req, res, next) {
  return regeneratorRuntime.async(function auth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            next();
          } catch (error) {
            res.status(400).render('signup');
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = auth;