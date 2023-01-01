"use strict";

require('dotenv').config();

var express = require('express');

var app = express();

var path = require('path');

var hbs = require("hbs");

var bcrypt = require("bcryptjs");

var auth = require("./middleware/auth");

var port = process.env.PORT || 5000;

require("./db/conn");

var Register = require("./models/registers");

var Device = require("./models/orders");

var Personal = require("./models/personals");

var _require = require('hbs'),
    registerPartials = _require.registerPartials;

var _require2 = require("express"),
    json = _require2.json;

var _require3 = require("express"),
    error = _require3.error;

var cookieParser = require('cookie-parser');

var static_path = path.join(__dirname, "../public");
var template_path = path.join(__dirname, "../templates/views");
var partials_path = path.join(__dirname, "../templates/partials");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
  extended: false
}));
app.use(express["static"](static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
console.log(process.env.SECRET_KEY);
var loginName = "login";
app.get("/", function (req, res) {
  res.render("index", {
    loginName: loginName
  });
});
app.get("/signup", function (req, res) {
  res.render('signup');
});
app.get("/service", auth, function (req, res) {
  res.render('service', {
    loginName: loginName
  });
});
app.get("/about", auth, function (req, res) {
  res.render('about');
});
app.get("/mobile", function (req, res) {
  res.render('mobile');
});
app.get("/ipad", function (req, res) {
  res.render('ipad');
});
app.get("/laptop", function (req, res) {
  res.render('laptop');
});
app.get("/airpods", function (req, res) {
  res.render('airpods');
});
app.get("/drones", function (req, res) {
  res.render('drones');
});
app.get("/smartwatch", function (req, res) {
  res.render('smartwatch');
});
app.get("/smarttv", function (req, res) {
  res.render('smarttv');
});
app.get("/order3", function (req, res) {
  res.render('order3');
});
app.get("/order2", function (req, res) {
  res.render('order2');
});
app.get("/secret", auth, function (req, res) {
  //  console.log(`this is the cookies ${req.cookies.jwt}`);
  res.render('secret');
}); // logout by clearCookie and jwt token 

app.get("/logout", auth, function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //   console.log(req.user);
          req.user.tokens = req.user.tokens.filter(function (currElement) {
            return currElement.token !== req.token;
          });
          res.clearCookie("jwt"); // console.log( req.user.tokens);

          console.log("logout successfully");
          _context.next = 6;
          return regeneratorRuntime.awrap(req.user.save());

        case 6:
          res.redirect("/");
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.status(500).send("you have already logged out sir !");

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // logout by clearCookie and jwt token 

app.get("/logoutall", auth, function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          //   console.log(req.user);
          //  req.user.tokens  = req.user.tokens.filter((currElement) => {
          //      return currElement.token !== req.token
          //  })
          req.user.tokens = [];
          res.clearCookie("jwt"); // console.log( req.user.tokens);

          console.log("logout successfully");
          _context2.next = 6;
          return regeneratorRuntime.awrap(req.user.save());

        case 6:
          res.redirect("/");
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).send("you have already logged out sir !");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // create a new user to our database

app.post("/register", function _callee3(req, res) {
  var password, cpassword, registerMember, token, registered;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          password = req.body.password;
          cpassword = req.body.confirmpassword;

          if (!(password === cpassword)) {
            _context3.next = 19;
            break;
          }

          registerMember = new Register({
            firstname: req.body.firstname,
            email: req.body.email,
            password: password,
            confirmpassword: cpassword
          });
          console.log(" the success part " + registerMember); //  jwt tkoen middleware 

          _context3.next = 8;
          return regeneratorRuntime.awrap(registerMember.generateAuthToken());

        case 8:
          token = _context3.sent;
          console.log("the token part " + token); //   registered jwt cookie

          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3000000),
            httpOnly: true
          });
          _context3.next = 13;
          return regeneratorRuntime.awrap(registerMember.save());

        case 13:
          registered = _context3.sent;
          //      loginName = registered.firstname;
          // const emails =  registered.id;
          console.log("the page part " + registered);
          console.log(registered.firstname);
          res.redirect("/");
          _context3.next = 20;
          break;

        case 19:
          res.send("passwords are not matching ");

        case 20:
          _context3.next = 26;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          res.status(400).send(_context3.t0);
          console.log("the error part page");

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
}); // check login to our database

app.post("/login", function _callee4(req, res) {
  var email, password, useremail, isMatch, token;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          email = req.body.email;
          password = req.body.password;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Register.findOne({
            email: email
          }));

        case 5:
          useremail = _context4.sent;
          console.log(useremail.firstname); // loginName = useremail.firstname;
          // bcrypt login compare

          _context4.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, useremail.password));

        case 9:
          isMatch = _context4.sent;
          _context4.next = 12;
          return regeneratorRuntime.awrap(useremail.generateAuthToken());

        case 12:
          token = _context4.sent;
          console.log(token); //    login jwt cookie

          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
          });

          if (isMatch) {
            res.redirect("/");
          } else {
            res.send("password is incorrect");
          }

          _context4.next = 21;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          res.status(400).send("invalid  email");

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
app.post("/order1", auth, function _callee5(req, res) {
  var email, userId, emails, deviceData;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          email = req.body.email;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Register.findOne({
            email: email
          }));

        case 4:
          userId = _context5.sent;
          emails = userId.email;
          console.log(email);
          console.log(emails);

          if (!(email === emails)) {
            _context5.next = 15;
            break;
          }

          deviceData = new Device(req.body);
          _context5.next = 12;
          return regeneratorRuntime.awrap(deviceData.save());

        case 12:
          res.redirect("order2");
          _context5.next = 16;
          break;

        case 15:
          res.send("email is incorrect");

        case 16:
          _context5.next = 21;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          res.status(400).send("email id should be the  same when you registered");

        case 21:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
app.post("/order2", auth, function _callee6(req, res) {
  var personalData;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          personalData = new Personal(req.body);
          _context6.next = 4;
          return regeneratorRuntime.awrap(personalData.save());

        case 4:
          res.redirect("order3");
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(400).send("not resubmit");

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // app.post("/order3", auth, async( req , res) =>{ 
//     try {
//     } catch (error) {
//         res.status(400).send("not submit");   
//     }    
// });

var a = 6;
var b = 5;

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'realback4c@gmail.com',
    pass: "02may2018"
  }
});
var mailOptions = {
  from: 'realback4c@gmail.com',
  to: 'sachin1245e@gmail.com',
  subject: "hello world",
  text: "hello jay"
};

if (a < b) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('error');
    } else {
      console.log("mail has  been sent", info.response);
    }
  });
} else {
  console.log("mail not sent");
}

app.get("*", function (req, res) {
  res.render('404');
});
app.listen(port, function () {
  console.log("listenig the port at ".concat(port));
});