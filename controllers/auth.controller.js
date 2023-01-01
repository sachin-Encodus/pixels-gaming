const User = require("../src/models/user");
const Device = require("../src/models/orders");
const Product = require("../src/models/devicedata");
const Games = require("../src/models/gamesdata");
const jwt = require("jsonwebtoken");
const path = require("path");
const orderSchema = require("../src/models/orderSchema");
const _ = require("lodash");
const Personal = require("../src/models/personals");
const Razorpay = require("razorpay");
const uniquId = require("uniqid");
const Formidable = require("formidable");
const request = require("request");
let orderId;
const handlebars = require("handlebars");
const fs = require("fs");

// const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const express = require("express");
// const auth = require("../src/middleware/auth");
// const app  = express();

const { OAuth2Client } = require("google-auth-library");
const {
  EMAIL,
  Account_Sid,
  Auth_Token,
  Service_id,
  KEY_ID,
  KEY_SECRET,
  CLIENT_URL,
  PASS,
  JWT_ACCOUNT_ACTIVATION,
  JWT_RESET_PASSWORD,
  SECRET_KEY,
} = require("../config/keys");

var instance = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});
// app.use(cookieParser());
// xmgrxqydtnrsfdet
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
  auth: {
    user: `${EMAIL}`,
    pass: `${PASS}`,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("=========>>>>>>>", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

exports.register = (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({ errors: "Email already is taken" });
      }

      const token = jwt.sign(
        {
          name,
          email,
          mobile,
          password,
        },
        JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: "60m",
        }
      );
      const register = fs.readFileSync(
        path.join(__dirname, "../template/register.hbs"),
        "utf8"
      );
      const template = handlebars.compile(register);

      const htmlToSend = template({
        CLIENT_URL,
        token,
        name,
        email,
      });

      const mailOptions = {
        from: {
    name: 'Realback',
    address: EMAIL
},
        to: email,
        subject: "Welcome to Realback",
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          return res.status(400).json({ errors: err });
        }
        return res.json({ mesaage: `email has been sent to ${email} ✔` });
      });
    });
  } catch (error) {
    return res.status(400).json({ errors: "something went wrong " });
  }
};

// exports.activate =  function(req, res) {

//    try {
//    const { token } = req.body;
//   // console.log(token);
//   if (token) {
//     jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION,function(err, decodedToken)  {
//       if (err) {
//         console.log('Activation error');
//         return res.status(401).json({
//           errors: 'Expired link. Signup again'
//         });
//       } else {
//         const { name, email, password } = decodedToken;

//    User.findOne({ email}).exec((err, user) => {
//       if ( user) {
//         return res.status(400).json({ errors: 'Email is taken' });
//   }
//     });
//         console.log(email);
//         console.log(name);
//         console.log(password);

//         let user =  new User({
//           name,
//            email,
//             password
//          });
// console.log(user)

//     user.save((err, user) => {
//           if (err) { console.log('Save error account activation');
//             return res.status(401).json({
//               errors: `error activating account`
//             });
//           } else {

//             return res.status(201).json( {

//               message : "success"});
//           }
//         });

//       }
//     } );

//   }
//   else{
//     return res.json({ errors: 'error happening please try again'});
//   }

// // const tokeni = await user.generateAuthToken();
// //      console.log(tokeni);
//    } catch (err) {
//       return res.status(401).json({ errors: `failed activating account` });
//    }

// };

exports.activate = async function (req, res) {
  try {
    const { token } = req.body;
    // console.log(token);
    if (token) {
      jwt.verify(
        token,
        JWT_ACCOUNT_ACTIVATION,
        async function (err, decodedToken) {
          if (err) {
            console.log("Activation error");
            return res.status(401).json({
              errors: "Expired link. Signup again",
            });
          }

          const { name, email, mobile, password } = decodedToken;
          User.findOne({ email }).exec((err, user) => {
            if (user) {
              return res.status(400).json({ errors: "Email is taken" });
            }

            console.log(email);
            console.log(name);
            console.log(mobile);
            const newUser = new User({
              name,
              email,
              mobile,
              password,
            });
            console.log(newUser);
            // const tokeni = await user.generateAuthToken();
            //  console.log(tokeni);
            newUser.save((err, user) => {
              if (err) {
                console.log("Save error account activation");
                return res.status(401).json({
                  errors: err,
                });
              }
              return res.status(201).json({
                message: "success",
              });
            });
          });
        }
      );
    } else {
      return res.json({ errors: "error happening please try again" });
    }
  } catch (err) {
    return res.status(401).json({ errors: `failed activating account` });
  }
};

exports.googlelogin = async function (req, res) {
  try {
    const { email } = req.body;
    User.findOne({ email }).exec(async (err, user) => {
      if (user) {
        console.log("=======", user);
        const token = await user.generateAuthToken();
        console.log("======>>>>ffff", token);
        return res.status(200).json({ user });
      } else {
        return res.status(401).json({ errors: err });
      }
    });
  } catch (err) {
    return res.status(401).json({ errors: `failed activating account` });
  }
};

exports.googlesignUp = async function (req, res) {
  try {
    const { name, email, mobile, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(200).json({ message: "login success" });
      }

      console.log(email);
      console.log(name);
      console.log(mobile);
      const newUser = new User({
        name,
        email,
        mobile,
        password,
      });
      console.log(newUser);
      // const tokeni = await user.generateAuthToken();
      //  console.log(tokeni);
      newUser.save((err, user) => {
        if (err) {
          console.log("Save error account activation");
          return res.status(401).json({
            errors: err,
          });
        }
        //
        return res.status(201).json({
          user,
        });
      });
    });
  } catch (err) {
    return res.status(401).json({ errors: `failed activating account` });
  }
};

// login api
exports.signin = async function (req, res) {
  try {
    const { email, password } = req.body;
    console.log("cookies",req.cookies.jwtoken);
    console.log(email, password);
    const user = await User.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, user.password);

    // login auth
    if (isMatch) {
      const token = await user.generateAuthToken();
      console.log(token);
        //  login jwt cookie
      // res.cookie("jwtoken", token, {
      //   expires: new Date(Date.now() + 6000000),
      //   httpOnly: true,
      // });
      // const myname = useremail.name;

      return res.status(201).json({ user, token });
    } else {
      return res.status(400).json({
        errors: " password do not match",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err,
    });
  }
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   const firstError = errors.array().map(error => error.msg)[0];
  //   return res.status(422).json({
  //     errors: firstError
  //   });
  // } else {
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }

    const token = jwt.sign({ _id: user._id }, JWT_RESET_PASSWORD, {
      expiresIn: "20m",
    });

    const resetpassword = fs.readFileSync(
      path.join(__dirname, "../template/resetpass.hbs"),
      "utf8"
    );
    const template = handlebars.compile(resetpassword);

    const htmlToSend = template({
      CLIENT_URL,
      token,
      email,
    });

    const mailOptions = {
      from: {
    name: 'Realback',
    address: EMAIL
},
      to: email,
      subject: "Welcome to Realback",
      html: htmlToSend,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return res.status(400).json({
          error: "Database connection error on user password forgot request",
        });
      } else {
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            return res.status(400).json({ errors: err });
          }
          return res.json({ mesaage: `email has been sent to ${email}` });
        });
      }

      //           sgMail
      //             .send(emailData)
      //             .then(sent => {
      //               // console.log('SIGNUP EMAIL SENT', sent)
      //               return res.json({
      //                 message: `Email has been sent to ${email}. Follow the instruction to activate your account`
      //               });
      //             })
      //             .catch(err => {
      //               // console.log('SIGNUP EMAIL SENT ERROR', err)
      //               return res.json({
      //                 message: err.message
      //               });
      //             });
      //         }
      //       }
      //     );
      //   }
      // );
    });
  });
};

exports.resetPass = (req, res) => {
  const { email, newPassword } = req.body;

  console.log(email, newPassword);
  try {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (user) {
        const updatedFields = {
          password: newPassword,
          // resetPasswordLink: ''
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password",
            });
          }
          return res.status(200).json({
            user,
          });
        });

        // return res.status(200).json({user});
      } else {
        return res.status(401).json({ errors: err });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ errors: error });
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   const firstError = errors.array().map(error => error.msg)[0];
  //   return res.status(422).json({
  //     errors: firstError
  //   });
  // } else {
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, JWT_RESET_PASSWORD, function (err, decoded) {
      if (err) {
        return res.status(400).json({
          error: "Expired link. Try again",
        });
      }

      User.findOne(
        {
          resetPasswordLink,
        },
        (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Something went wrong. Try later",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error resetting user password",
              });
            }
            res.json({
              message: `Great! Now you can login with your new password`,
            });
          });
        }
      );
    });
  }
};

exports.adminMiddleware = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        errors: "User not found",
      });
    }

    if (user.role == null) {
      return res.status(400).json({
        errors: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};

// // Google login

// const client = new OAuth2Client("363253994087-8v0st55651s53q0ni7t18i1gke5qkqpf.apps.googleusercontent.com");
// // Google Login
// exports.googleController = (req, res) => {
//   const { idToken } = req.body;

//   client
//     .verifyIdToken({ idToken, audience: "363253994087-8v0st55651s53q0ni7t18i1gke5qkqpf.apps.googleusercontent.com" })
//     .then(response => {
//       // console.log('GOOGLE LOGIN RESPONSE',response)
//       const { email_verified, name, email } = response.payload;
//       if (email_verified) {
//         User.findOne({ email }).exec((err, user) => {
//           if (user) {
//             const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
//               expiresIn: '7d'
//             });
//             const { _id, email, name, role } = user;
//             return res.json({
//               token,
//               user: { _id, email, name, role }
//             });
//           } else {
//             let password = email + SECRET_KEY;
//             user = new User({ name, email, password });
//             user.save((err, data) => {
//               if (err) {
//                 console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
//                 return res.status(400).json({
//                   error: 'User signup failed with google'
//                 });
//               }
//                 console.log(user);
//               const token = jwt.sign(
//                 { _id: data._id },
//                 process.env.SECRET_KEY,
//                 { expiresIn: '7d' }
//               );
//               const { _id, email, name, role } = data;
//               return res.json({
//                 token,
//                 user: { _id, email, name, role }
//               });
//             });
//           }
//         });
//          console.log("success");
//       } else {
//         console.log("error");
//         return res.status(400).json({
//           error: 'Google login failed. Try again'
//         });
//       }
//     });
// };

// exports.resetPasswordController = (req, res) => {
//   const { resetPasswordLink, newPassword } = req.body;

//   // const errors = validationResult(req);

//     if (resetPasswordLink) {
//       jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err,decoded ) {
//         if (err) {
//           return res.status(400).json({
//             error: 'Expired link. Try again'
//           });
//         }

//         User.findOne({  resetPasswordLink }, (err, user) => {
//             if (err || !user) {
//               return res.status(400).json({
//                 error: 'Something went wrong. Try later'
//               });
//             }

//             const updatedFields = {
//               password: newPassword,
//               resetPasswordLink: ''
//             };

//             user = _.extend(user, updatedFields);

//             user.save((err, result) => {
//               if (err) {
//                 return res.status(400).json({
//                   error: 'Error resetting user password'
//                 });
//               }
//               res.json({ message: `Great! Now you can login with your new password` });

//             });

//           });
//       });

//   }
// };

// exports.resetPasswordController = (req, res) => {
//   const { resetPasswordLink, newPassword } = req.body;

// if(resetPasswordLink){

// }else{
//   return res.status(401).json({error: "Authneticaton error"})
// }

// }

// // logout by clearCookie and jwt token
// exports.logout =   async function( req , res){
//        try {
//         //   console.log(req.user)
//          req.user.tokens  = req.user.tokens.filter((currElement) => {
//              return currElement.token !== req.token
//          })
//         // res.clearCookie("jwt");
// // console.log( req.user.tokens);
//          console.log("logout successfully");
//          await req.user.save();
//          res.send("you have  logged out sir !");
//        } catch (error) {
//           res.send("catch some error !")
//          res.status(500).send("you have already logged out sir !");
//        }

// };

exports.updatestatus = async function (req, res) {
  console.log(req.body.userId, req.body.value);
  try {
    Device.findOneAndUpdate(
      {
        _id: req.body.userId,
      },
      {
        status: req.body.value,
      },
      { new: true },
      function (err, result) {
        //Error handling
        if (err) {
          return res.status(500).send("Something broke!");
        }

        //Send response based on the required
        else {
          const EventEmitter = req.app.get("eventemitter");
          EventEmitter.emit("orderUpdated", {
            _id: req.body.userId,
            status: req.body.value,
            email: req.body.email,
          });
          res.status(201).send({ result });
        }
      }
    );
  } catch (error) {
    console.log("logout error");
    res.status(500).json(error);
  }
};

exports.approveStatus = async function (req, res) {
  console.log(req.body.userId, req.body.value);
  const { email, value } = req.body;
  try {
    User.findOneAndUpdate(
      {
        _id: req.body.userId,
        "subscriber._id": req.body.subID,
      },

      { $set: { "subscriber.$.status": req.body.value } },
      { new: true },
      function (err, result) {
        //Error handling
        if (err) {
          return res.status(500).send("Something broke!");
        }

        //Send response based on the required
        else {
          res.status(201).send({ result });
          if (value === "reject" || value === "approved") {
            const approved = fs.readFileSync(
              path.join(__dirname, "../template/approved.hbs"),
              "utf8"
            );
            const reject = fs.readFileSync(
              path.join(__dirname, "../template/reject.hbs"),
              "utf8"
            );
            const template = handlebars.compile(
              value === "approved" ? approved : reject
            );

            const htmlToSend = template({
              email,
            });

            const mailOptions = {
              from: EMAIL,
              to: email,
              subject: "Team Realbek",
              html: htmlToSend,
            };

            transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                console.log("not sent ", err);
                return res.status(400).json({ errors: err });
              }
              //  return res.json({mesaage: `email has been sent to ${email} ✔`})
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.userData = async function (req, res) {
  try {
    await User.findOne({ _id: req.params.id }, (err, user) => {
      if (user) {
        console.log("==================>>>>>>>>>>>", user);
        return res.status(201).send({
          user,
        });
      } else {
        console.log(err);
      }
      // console.log(user);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};
// !all userdata
exports.alluser = async function (req, res) {
  try {
    await User.find({}, (err, user) => {
      if (user) {
        console.log(user);
        return res.status(201).send({
          user,
        });
      } else {
        console.log(err);
      }
      // console.log(user);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};
exports.orderData = async function (req, res) {
  console.log(req.cookies.jwtoken);
  try {
    await Device.find({}, (err, user) => {
      if (user) {
        return res.status(201).send({
          user,
        });
      } else {
        console.log(err);
      }
      // console.log(user);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};

// logout by clearCookie and jwt token
exports.cart = async function (req, res) {
  try {
    await Device.find({ email: req.Email }, (err, user) => {
      if (user) {
        // console.log(user);
        return res.status(201).send({
          user,
        });
      } else {
        console.log(err);
      }
      // console.log(user);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};
//! prouser
exports.subscriber = async function (req, res) {
  const {
    email,

    adhaarImg,
    adhaarBackImg,
    panImg,
    number,
    status,

    expiredate,
  } = req.body;

  try {
    const prouser = await User.findOne({ email });

    if (prouser) {
      const subscribe = await prouser.addPro(
        email,

        adhaarImg,
        adhaarBackImg,
        panImg,
        number,
        status,

        expiredate
      );

      await prouser.save();

      res.status(201).json({ message: "ProUser enabled" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};
exports.cartid = async function (req, res) {
  try {
    await Device.findOne({ _id: req.params.id }, (err, user) => {
      if (user) {
        // console.log(user);
        return res.status(201).send({
          user,
        });
      } else {
        console.log(err);
      }
      // console.log(user);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};

exports.cartotp = async function (req, res) {
  try {
    await Device.findOne({ orderOtp: req.params.id }, (err, user) => {
      if (user) {
        // console.log(user);
        return res.status(201).send({
          user,
        });
      } else {
        res.status(500).json({ err: "Please  enter valid Otp !" });
      }
      // console.log(user);
    });
  } catch (error) {
    res.status(500).json({ err: "Please  enter valid Otp !" });
  }
};

// // logout by clearCookie and jwt token
// exports.address = async function (req, res) {
//   try {
//     await Device.find({ email: req.params.id }, (err, user) => {
//       if (user) {
//         return res.status(201).send({
//           user,
//         });
//       } else {
//         console.log(err);
//       }
//       console.log(user);
//     });
//   } catch (error) {
//     console.log("logout error");
//     res.status(500).json({ message: "you have already logged out sir !" });
//   }
// };

// devices
exports.device = async function (req, res) {
  //     try {

  // const email = req.body.email;

  //  const userId = await User.findOne({email:email});
  // const emails = userId.email;

  // console.log(email);
  //  console.log(emails);

  //  if(email === emails){

  //           const deviceData = new Device(req.body);
  //       await deviceData.save();
  //         return res.status(201).json({mesaage: "confirmed"});

  //     } else{

  //      res.send("email is incorrect");
  //     }

  //     } catch (error) {
  //         res.status(400).send("email id should be the  same when you registered");
  //     }

  // };
  try {
    const email = req.body.email;
    console.log("========>>>>>>", email);
    const userId = await User.findOne({ email: email });
    const emails = userId.email;
    console.log("=====>>>", userId);

    console.log(email);
    console.log(emails);

    if (email === emails) {
      console.log("call");
      const deviceData = new Device(req.body);
      await deviceData.save();

      const {
        orderOtp,
        email,
        name,
        _id,
        number,
        products,
        totalPrice,
        company,
        model,
        mode,
        city,
        pincode,
        Address,
        state,
        country,
        date,
        expiredate,
      } = deviceData;
      console.log("========>>>>>>>>", mode);
      const data = products.map((item) => {
        return item.name;
      });
      const emailWithPaylater = fs.readFileSync(
        path.join(__dirname, "../template/paylater.hbs"),
        "utf8"
      );
      const emailWithoutPaylater = fs.readFileSync(
        path.join(__dirname, "../template/order.hbs"),
        "utf8"
      );
      const template = handlebars.compile(
        mode === "paylater" ? emailWithPaylater : emailWithoutPaylater
      );

      const htmlToSend = template({
        name,
        Address,
        totalPrice,
        company,
        city,
        pincode,
        orderOtp,
        state,
        country,
        date,
        model,
        expiredate,
        data,
        mode,
      });

      console.log("=======>>>>>>>>", deviceData, orderOtp, email, name);
      console.log("===>>..", email);
      const arrayUsersMail = ["realback4c@gmail.com", email];

      const stringUsersMail = arrayUsersMail.join(", ");
      const mailOptions = {
        from: EMAIL,
        to: stringUsersMail,
        subject: "Team Realbek",
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log("not sent ", err);
          return res.status(400).json({ errors: err });
        }
        //  return res.json({mesaage: `email has been sent to ${email} ✔`})
      });

      console.log("email sent");
      const EventEmitter = req.app.get("eventemitter");
      EventEmitter.emit("orderPlaced", deviceData);
      return res.status(201).json({ _id });
    } else {
      console.log("!email ");
      return res.status(400).json({ errors: "email is not match" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errors: err });
  }
};

exports.personal = async function (req, res) {
  try {
    const email = req.body.email;
    const userId = await User.findOne({ email: email });
    const emails = userId.email;

    console.log(email);
    console.log(emails);

    if (email === emails) {
      const personalData = new Personal(req.body);
      await personalData.save();
      console.log("success");
      return res.status(201).json({ message: "success" });
    } else {
      console.log("!email ");
      return res.status(400).json({ errors: "email is not match" });
    }
  } catch (err) {
    console.log("error");
    return res
      .status(400)
      .json({ errors: "email id should be the same when you loggedin" });
  }
};

//     const {  name, email, number, countary,  state,  city,  pincode,   Address, } = req.body;

// //  const userId = await User.findOne({email:email});
// // const emails = userId.email;

// // console.log(email);
// //  console.log(emails);

// //  if(email === emails){

//    const personalData = new Personal( name, email, number, countary,  state,  city,  pincode,   Address,);
//       await personalData.save();

//            await personalData.save(); ((err, personalData) => {
//           if (err) { console.log('Save error account activation');
//             return res.status(401).json({
//               errors: `error activating account`
//             });
//           } else {

//             return res.status(201).json( {message : "success"});
//           }
//         });
// //     } else{
// // console.log("incorrect email")
// //     return res.status(400).json({error: "email is not match"});
// //     }
//     } catch (err) {
//       console.log("incorrect ")
//          return res.status(400).json({error: "not submit"});
//     }

const accountSid = Account_Sid;
const authToken = Auth_Token;
// Set environment variables for your Account Sid and Auth Token!
// These can be found at twilio.com/console



const client = require("twilio")(accountSid, authToken);

// const accountSid = "AC9627beb94cd72e5dea9f3f626e09db90";
// const authToken = "f4dbd2ff58c356d09332af72a519e863";
// const client = require("twilio")(accountSid, authToken);
// const number = "9000000000"
// client.lookups
//   .phoneNumbers("+91" + number)
//   .fetch({ type: ["carrier"] })
//   .then((phone_number) => {
//     console.log(phone_number.carrier); // All of the carrier info.
//     console.log(phone_number.carrier.name);
//   })
//   .catch((err) => {
//     console.log(err);
//   }); // Just the carrier name.


exports.otp = (req, res) => {
  const { number } = req.body;
  client.verify
    .services(Service_id)
    .verifications.create({ to: "+91" + number, channel: "sms" })
    .then((verification) => {
      res.status(200).json({ verification });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.Verifyotp = (req, res) => {
  const { number, otp } = req.body;
  console.log(number, otp);
  client.verify
    .services(Service_id)
    .verificationChecks.create({ to: "+91" + number, code: otp })
    .then((verification_check) => {
      res.status(200).json({ verification_check });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//!Email otp

exports.emailOtp = (req, res) => {
  const { number } = req.body;
  client.verify
    .services(Service_id)
    .verifications.create({ to: "+91" + number, channel: "sms" })
    .then((verification) => {
      res.status(200).json({ verification });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.whatsapp = (req, res) => {
  try {
    client.messages
      .create({
        body: "Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and should be delivered on July 10, 2019. Details: http://www.yummycupcakes.com/",
        from: "whatsapp:+14155238886",
        to: "whatsapp:+919522540020",
      })
      .then((message) => console.log(message.sid))
      .done();
    return res.status(200).json("success");
  } catch (error) {
    return res.status(400).json({ error });
  }
};




exports.upi =(req, res) =>{
  const options = req.body
  instance.invoices.create(options , function (err, order){
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
   
    return res.status(200).json(order);
  });
}

exports.payment = (req, res) => {
  const { price } = req.params;

  console.log(price);

  const amount = price * 100;
  const currency = "INR";
  const receipt = uniquId();

  instance.orders.create({ amount, currency, receipt }, function (err, order) {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    orderId = order.id;
    return res.status(200).json(order);
  });
};

exports.paymentCallback = (req, res) => {
  // const {_id} = req.params
  console.log("webhook triggerd");
  // const form = Formidable();
  // form.parse(req, (err, fields, files) => {
  console.log("=====>>>>>>>>>>", JSON.stringify(req.body));
  //  const ID = JSON.stringify(req.body)
  //    console.log("=========>>>>",req.body.payload);
  //  console.log("=========>>>>",req.body.payload.payment.entity.notes.address);
  const { email, contact, notes, id, order_id } =
    req.body.payload.payment.entity;

  const _id = notes.address;
  console.log("....>>>>>", _id);
  //  const {notes} = req.body
  //  console.log(">>>>>>>>>>",notes);
  // console.log("FIELDS", fields);
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("SHA256", "sachin4c")
    .update(JSON.stringify(req.body))
    .digest("hex");
  console.log(hash);
  console.log(req.headers["x-razorpay-signature"]);

  if (hash === req.headers["x-razorpay-signature"]) {
    // const info = {
    //   _id: fields.razorpay_payment_id,
    //   razorpay_order_id: fields.razorpay_order_id,
    // };
    // const order = new orderSchema({
    //   _id: info._id,
    //   orders: fields.razorpay_order_id,
    // });

    // order.save((err, data) => {
    //   if (err) {
    //     res.status(400).json({
    //       error: "Not able to save in Db",
    //     });
    //   } else {
    //     console.log("=========>>>>>>>>>success",order);
    //     // res.redirect(
    //     //   `${CLIENT_URL}/payment/status/${fields.razorpay_payment_id}`
    //     // );
    //   }
    // });
    // const _id = "60c71706ecc5e725b0e2c5a1"
    console.log("going");
    Device.findOne(
      {
        _id,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "Something went wrong. Try later",
          });
        }

        const updatedFields = {
          mode: "success",
          paymentid: id,
          orderid: order_id,
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password",
            });
          }

          res.json({
            message: `payment accept`,
          });
        });
      }
    );
    console.log("success");
  } else {
    console.log("error");
  }

  // });
};
exports.getLogo = (req, res) => {
  res.sendFile(path.join(__dirname, "m18.png"));
};

exports.getPayment = (req, res) => {
  orderSchema.findById(req.params.paymentId).exec((err, data) => {
    if (err || data == null) {
      return res.json({
        error: "No order Found",
      });
    }
    request(
      `https://${KEY_ID}:${KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}`,
      function (error, response, body) {
        if (body) {
          const result = JSON.parse(body);
          res.status(200).json(result);
        }
      }
    );
  });
};





exports.product = async function (req, res) {
  try {
    const { model, Dtype, deviceName } = req.body;
   

      console.log(
        "====>>>>>>>>>>>>>>",
        JSON.stringify(model),
        Dtype,
        deviceName
      );
        const personalData = new Product(req.body);
        await personalData.save();
    return res.status(201).json("pass data");
    
  } catch (err) {
    return res.status(401).json(err);
  }
};




exports.getCompany = async function (req, res) {
  try {
    const { Dtype } = req.params;
    console.log(Dtype);
    await Product.find({ Dtype }, (err, device) => {
      if (device) {
        console.log(device);
        return res.status(201).send({
          device,
        });
      } else {
        console.log(err);
      }
      console.log(device);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json(error);
  }
};


exports.getmodel = async function (req, res) {
  try {
    const { itemValue } = req.params;
    console.log(itemValue);
    await Product.findOne({ _id: itemValue }, (err, device) => {
      if (device) {
        console.log(device);
        return res.status(201).send({
          device,
        });
      } else {
        console.log(err);
      }
      console.log(device);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json(error);
  }
};


exports.getmodedata = async function (req, res) {
  try {
    const { id } = req.params;
    console.log(id);
    await Product.findOne(
      { _id: id },

      (err, device) => {
        if (device) {
          console.log(device);
          return res.status(201).send({
            device,
          });
        } else {
          console.log(err);
        }
        console.log(device);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

 
// Game APIs Endpoints

exports.addGames = async function (req, res) {
  try {
    console.log("###############", req.body);
      const newGame = new Games(req.body)
      console.log(newGame);

      newGame.save((err, game) => {
        if (err) {
          console.log("Failed to add game",err);
          return res.status(401).json({
            errors: err,
          });
        }
        //
        return res.status(201).json({
          game
        });
      });

  } catch (err) {
    return res.status(401).json({ errors: `failed activating account` });
  }
};


// fetch all games
exports.getAllGames = async function (req, res) {
  try {
    await Games.find({}, (err, game) => {
      if (game) {
        console.log(game);
        return res.status(201).send({
          game,
        });
      } else {
        console.log(err);
      }
      // console.log(user);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};


// fetch game by cat
exports.userData = async function (req, res) {
  try {
    await User.findOne({ _id: req.params.id }, (err, user) => {
      if (user) {
        console.log("==================>>>>>>>>>>>", user);
        return res.status(201).send({
          user,
        });
      } else {
        console.log(err);
      }
      // console.log(user);
    });
  } catch (error) {
    console.log("logout error");
    res.status(500).json({ message: "you have already logged out sir !" });
  }
};










// https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-next-js-app-with-nodejs-backend-7ff91841bd3