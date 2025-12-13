const Reservation = require("../models/Reservation");
const Payment = require("../models/RentPayment");
const User = require("../models/User");

exports.dashboard = async (req, res) => {
  try {
    // -------------------------------
    // PROPER SESSION CHECK
    // -------------------------------
    if (!req.session.user) return res.redirect("/user/login");

    // -------------------------------
    // GET LOGGED-IN USER
    // -------------------------------
    const user = await User.findById(req.session.user._id).lean();
    if (!user) return res.redirect("/user/logout");

    const userId = user._id.toString();

    // -------------------------------
    // FETCH USER RESERVATIONS
    // -------------------------------
    const reservations = await Reservation.find({ userId })
      .populate("branchId")
      .sort({ createdAt: -1 })
      .lean();

    // -------------------------------
    // FETCH USER PAYMENTS
    // -------------------------------
    let payments = await Payment.find({ userId })
      .sort({ year: -1, month: -1 })
      .lean();

    // Add Month Names
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    payments = payments.map(p => ({
      ...p,
      monthName: p.month ? monthNames[p.month - 1] : "-"
    }));

    // -------------------------------
    // RENT SUMMARY STATS
    // -------------------------------
    let totalPaid = 0;
    let pendingMonths = 0;
    let nextDueDate = "Not Started";

    const confirmed = payments.filter(p => p.status === "Confirmed");
    totalPaid = confirmed.reduce((sum, p) => sum + (p.amount || 0), 0);

    // If no reservations → show empty stats
    if (reservations.length === 0) {
      return res.render("user/dashboard", {
        session: req.session,
        user,
        reservations: [],
        payments,
        stats: { totalPaid, pendingMonths, nextDueDate }
      });
    }

    // Active reservation
    const r = reservations[0];

    if (r.startDate) {
      const start = new Date(r.startDate);
      const today = new Date();

      const monthsPassed =
        today.getFullYear() * 12 +
        today.getMonth() -
        (start.getFullYear() * 12 + start.getMonth());

      pendingMonths = Math.max(0, monthsPassed - confirmed.length);

      // Next due date
      const next = new Date(start);
      next.setMonth(start.getMonth() + confirmed.length);
      nextDueDate = next.toLocaleDateString("en-PK");
    }

    // -------------------------------
    // FINAL RENDER
    // -------------------------------
    return res.render("user/dashboard", {
      session: req.session,
      user,
      reservations,
      payments,
      stats: { totalPaid, pendingMonths, nextDueDate }
    });

  } catch (err) {
    console.log("User Dashboard Error:", err);
    return res.send("Dashboard Error: " + err.message);
  }
};
