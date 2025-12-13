const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema({
  single: Number,
  double: Number,
  three: Number,
  four: Number,
  five: Number,
  six: Number,
  seven: Number
});

module.exports = mongoose.model("Pricing", pricingSchema);
