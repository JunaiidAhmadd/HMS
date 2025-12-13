const Branch = require("../models/Branch");
const Room = require("../models/Room");
const Reservation = require("../models/Reservation");

exports.dashboard = async (req, res) => {
  const stats = {
    branches: await Branch.countDocuments(),
    rooms: await Room.countDocuments(),
    bookings: await Reservation.countDocuments(),
    pending: await Reservation.countDocuments({ status: "Pending" })
  };

  const recentBookings = await Reservation.find()
    .populate("branchId")
    .sort({ createdAt: -1 })
    .limit(10);

  const mapped = recentBookings.map(r => ({
    ...r.toObject(),
    branch: r.branchId,
    bookingId: r._id.toString().slice(-6).toUpperCase()
  }));

  res.render("admin/dashboard", { stats, recentBookings: mapped });
};
