const mongoose = require('mongoose');
// const jwt = require("jsonwebtoken");
const opts = { toJSON: { virtuals: true }};
const GameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
     
    },
    coverImage: {
        type: String,
      },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    Reviews:[{}],

    price: {
      type: String,
    },

    date: {
      type: String,
      default: Date.now()
    },

  },
  opts
);


// now we create to a Collection
 const Games = new mongoose.model("Games", GameSchema);

module.exports = Games;