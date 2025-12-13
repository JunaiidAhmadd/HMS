const Reservation = require("../models/Reservation");
const RentPayment = require("../models/RentPayment");
const User = require("../models/User");
const Branch = require("../models/Branch");


exports.listResidents = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: "Approved" })
      .populate("branchId")
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    const residents = reservations.map(r => ({
      _id: r._id,
      fullName: r.fullName,                    // Name stored in reservation
      email: r.email,
      branchName: r.branchId ? r.branchId.name : "-",
      roomType: r.roomType,
      monthlyRent: r.price,
      createdAt: r.createdAt,

      // Pulled from User model
      userName: r.userId ? r.userId.fullName : r.fullName,
      userId: r.userId ? r.userId._id : null
    }));

    const branches = await Branch.find();
    res.render("admin/residents", { residents, branches });

  } catch (err) {
    console.log("Residents List Error:", err);
    res.send("Error: " + err.message);
  }
};


exports.viewPayments = async (req, res) => {
  try {
    const reservationId = req.params.id;

    // Fetch payments with user info
    const payments = await RentPayment.find({ reservationId })
      .populate("userId", "fullName email")
      .sort({ year: -1, month: -1 })
      .lean();

    // Fetch reservation for name heading
    const reservation = await Reservation.findById(reservationId).lean();

    const residentName = reservation ? reservation.fullName : "Unknown User";

    // Convert month number → month name
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formattedPayments = payments.map(p => ({
      ...p,
      monthName: monthNames[p.month - 1] || p.month,
      userName: p.userId ? p.userId.fullName : "Unknown User",
      reservationId: reservationId  // send this for confirm button URL
    }));

    // Send to EJS
    res.render("admin/resident_payments", {
      residentName,
      payments: formattedPayments,
      reservation // Pass full reservation object for "Add Payment" modal
    });

  } catch (err) {
    console.log("View Payments Error:", err);
    res.send("Error: " + err.message);
  }
};




exports.confirmPayment = async (req, res) => {
  try {
    const { reservationId, paymentId } = req.params;

    await RentPayment.findByIdAndUpdate(paymentId, {
      status: "Confirmed"
    });

    return res.redirect(`/admin/residents/${reservationId}/payments`);
  } catch (err) {
    console.log("Confirm Payment Error:", err);
    return res.redirect(`/admin/residents/${req.params.reservationId}/payments`);
  }
};


exports.addCashPayment = async (req, res) => {
  try {
    const { userId, reservationId, amount, month, year } = req.body;

    await RentPayment.create({
      userId,
      reservationId,
      amount,
      month,
      year,
      method: "cash",
      status: "Confirmed",
      notes: "Cash recorded by admin"
    });

    res.redirect(`/admin/residents/${reservationId}/payments`);

  } catch (err) {
    console.log("Cash Payment Error:", err);
    res.send("Error: " + err.message);
  }
};
