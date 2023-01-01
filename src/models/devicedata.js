const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
const ProductSchema = new mongoose.Schema({
  deviceName: { type: String },
  Cimage: { type: String },
  model: [
    {
      modelno: { type: String },
      image: { type: String },
      modedata: [
        {
          productName: { type: String },
          name: { type: String },
          price: { type: String },
        },
      ],
    },
  ],

  Dtype: {
    type: String,
    required: true,
  },
});

// now we create to a Collection
const Product = new mongoose.model("Product", ProductSchema);

module.exports = Product;
