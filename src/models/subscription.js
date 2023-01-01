const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
const SubscriptionSchema = new mongoose.Schema({
  user_id: { type: String },
  payment_id: { type: String },
  amount: { type: String },
  startDate:{ type: String },
  endDate:{type :String},
  type:{type :String},
  status:{type :String}
});

// now we create to a Collection
const Subscription = new mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;