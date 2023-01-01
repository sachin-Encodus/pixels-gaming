require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
cron = require("node-cron");
const cors = require("cors");
const port = process.env.PORT || 3000;
const morgan = require("morgan");
const connection = require("./src/db/conn");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

var whitelist = [
  "http://localhost:3000",
];
var corsOptions = {
  origin: function(origin, callback) {
    //console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || origin == undefined) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors({ credentials: true ,origin: true}));
// app.options("*", cors({ credentials: true, origin: true }));
app.get("/", (req, res)=>{
  return res.json({message:"server is running"})
})
const authRoutes = require("./src/routes/auth.route");
const userRouter = require("./src/routes/user.route");
app.use("/api", authRoutes);
app.use("/api", userRouter);


app.listen(port, () => {
  console.log(`listenig the port at ${port}`);
});
// https://www.bootdey.com/react-native-snippets
