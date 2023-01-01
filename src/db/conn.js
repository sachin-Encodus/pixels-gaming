
const mongoose = require('mongoose');
const {MONGO_URI} = require('../../config/keys')



// const DB = process.env.MONGO_URI
mongoose.connect(MONGO_URI, {
   useNewUrlParser:true,
   useUnifiedTopology:true,
   useCreateIndex:true,
   useFindAndModify:false
}).then(() => {

  console.log(`connection successful`);

}).catch((e) => {

    console.log(`no connection `);
})






















// const mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/realback",{
   
//    useNewUrlParser:true,
//    useUnifiedTopology:true,
//    useCreateIndex:true

// }).then(() => {

//   console.log(`connection successful`);

// }).catch((e) => {

//     console.log(`no connection `);
// })