const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// Load Controllers
const {
  register,
  activate,
  signin,
  device,
  cart,
  personal,
  payment,
  forgotPasswordController,
  resetPasswordController,
  googleController,
  paymentCallback,
  getPayment,
  getLogo,
  orderData,
  userData,
  otp,
  Verifyotp,
  googlesignUp,
  googlelogin,
  resetPass,
  whatsapp,
  upi,
  product,
  getCompany,
  getmodel,
  getmodedata,
  cartid,
  updatestatus,
  cartotp,
  subscriber,
  alluser,
  approveStatus,
  addGames,
  getAllGames
} = require("../../controllers/auth.controller");

router.get("/rootUser", auth, (req, res) => {
  res.status(200).json(req.rootUser);
});

router.get("/logoutall", auth, async (req, res) => {
  try {
    req.rootUser.tokens = [];

    res.clearCookie("jwtoken");

    await req.rootUser.save();
    return res.status(200).json(req.rootUser);
  } catch (error) {
    res.status(500).send("you have already logged out sir !");
  }
});
router.get("/logout", auth, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currElement) => {
      return currElement.token !== req.token;
    });

    res.clearCookie("jwtoken");

    // console.log( req.user.tokens);

    await req.rootUser.save();
    console.log("============================ aya hai yha tak");
  } catch (error) {
    res.status(500).send("you have already logged out sir !");
  }

  res.status(200).json(req.rootUser);
});
router.post("/register", register);
router.post("/addgame", addGames);
router.get("/get/games", getAllGames);
router.post("/signin", signin);
router.post("/device", device);
router.get("/cart", auth, cart);
router.get("/cartid/:id", cartid);
router.get("/cartotp/:id", cartotp);

router.post("/status", updatestatus);
router.post("/approved", approveStatus);
router.post("/subscriber", auth, subscriber);
router.get("/order",  orderData);
router.get("/user/:id", userData);
router.get("/userdata", alluser);
router.post("/otp", otp);
router.post("/Verifyotp", Verifyotp);

router.get("/payment/:price", payment);
router.post("/payment/callback", paymentCallback);
router.get("/payments/:paymentId", getPayment);
router.get("/logo", getLogo);
// router.get('/logoutall', logoutall);
router.post("/activate-email", activate);
router.get("/whatsapp", whatsapp);
router.post("/activate-email", activate);
router.post("/personal", personal);
router.post("/googlesignUp", googlesignUp);
router.post("/upi", upi);
router.post("/googlelogin", googlelogin);
router.post("/product", product);

router.get("/getCompany/:Dtype", getCompany);
router.get("/getmodel/:itemValue", auth, getmodel);
router.get("/getmodedata/:id", auth,  getmodedata);
// forgot reset password
router.put("/forgotpassword", forgotPasswordController);
router.put("/resetpassword", resetPasswordController);
router.put("/resetPass", resetPass);
module.exports = router;