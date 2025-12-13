const mongoose = require("mongoose");

const RentPaymentSchema = new mongoose.Schema({
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    month: { type: Number, required: true },
    year: { type: Number, required: true },

    amount: { type: Number, required: true },

    method: { type: String, enum: ["cash", "online"], default: "cash" },

    screenshot: { type: String, default: null },

    status: { type: String, enum: ["Pending", "Confirmed", "Rejected"], default: "Pending" },

}, { timestamps: true });

module.exports = mongoose.model("RentPayment", RentPaymentSchema);
