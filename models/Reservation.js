const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  cnic: String,

  occupation: String,
  studentId: String,
  semester: String,
  institute: String,

  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  roomType: String,
  occupants: Number,

  startDate: Date,
  durationMonths: Number,
  notes: String,

  price: Number,
  status: { type: String, default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reservation", reservationSchema);
