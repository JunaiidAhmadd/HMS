const RentPayment = require("../models/RentPayment");
const Reservation = require("../models/Reservation");

exports.getOverdueList = async (req, res) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Fetch valid reservations only
    const reservations = await Reservation.find({
      status: "Approved",
      branchId: { $ne: null },
      userId: { $ne: null }
    })
      .populate("userId")
      .populate("branchId")
      .lean();

    const overdue = [];

    for (let r of reservations) {

      // Check if user paid for this month
      const paid = await RentPayment.findOne({
        reservationId: r._id,
        month,
        year,
        status: "Confirmed"
      });

      // If not paid → overdue
      if (!paid) {
        overdue.push({
          reservationId: r._id,
          userId: r.userId._id,
          userName: r.userId.fullName,
          branchName: r.branchId.name,
          roomType: r.roomType,
          rentAmount: r.price
        });
      }
    }

    return res.json({ success: true, overdue });

  } catch (err) {
    console.error("🔥 OVERDUE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// MARK AS PAID (Cash payment)
exports.markAsPaid = async (req, res) => {
  try {
    const { reservationId, userId, amount } = req.body;

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    await RentPayment.create({
      reservationId,
      userId,
      amount,
      month,
      year,
      method: "cash",
      status: "Confirmed"
    });

    return res.redirect("/admin/residents");

  } catch (err) {
    console.error("🔥 MARK PAID ERROR:", err);
    return res.redirect("/admin/residents");
  }
};
