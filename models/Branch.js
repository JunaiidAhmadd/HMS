const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: String,
  address: String,
  facilities: [String],
  photos: [String]
});

module.exports = mongoose.model("Branch", branchSchema);
