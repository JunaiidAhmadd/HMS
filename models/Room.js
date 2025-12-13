const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  type: String,
  capacity: Number,
  facilities: [String],
  price: Number,
  images: [String]
});

module.exports = mongoose.model("Room", roomSchema);
