const mongoose = require('mongoose');
// personal detailes  schema

const PersonalSchema = new mongoose.Schema({

   

     name:{
      type:String,
      required:true

   },
      
     email:{
      type:String,
    required:true

   },
   number:{
      type:String,
      required:true
   },

country:{
      type:String,
      required:true

   },
      
     state:{
      type:String,
    required:true

   },
   city:{
      type:String,
      required:true
   },

  
pincode:{
      type:String,
      required:true

   },
      
     Address:{
      type:String,
    required:true,

     }

})


// now we create to a Collection
 const Personal = new mongoose.model("Personal",  PersonalSchema);

module.exports = Personal;
