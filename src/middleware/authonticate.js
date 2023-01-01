const Register = require("../models/registers");
const Device = require("../models/orders")
const auth = async (req, res , next ) => {
 
    
    try {
      
        

    next();

    } catch (error) {
      
       res.status(400).render('signup') ;
    }


}


module.exports = auth;