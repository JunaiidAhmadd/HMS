const RentPayment = require("../models/RentPayment");
const Reservation = require("../models/Reservation");

// ================================================
//  SECURE RENT PAYMENT UPLOAD (FINAL VERSION)
// ================================================
exports.uploadReceipt = async (req, res) => {
  try {
    // SESSION CHECK
    if (!req.session.user) {
      console.log("Session expired while uploading rent");
      return res.redirect("/user/login");
    }

    const { reservationId, monthYear, amount } = req.body;

    // --- VALIDATION (Prevent Empty Entries) ---
    if (!reservationId || !monthYear || !amount) {
      console.log("IGNORED — Missing required rent fields");
      return res.redirect("/user/dashboard");
    }

    if (Number(amount) <= 0) {
      console.log("IGNORED — Amount must be > 0");
      return res.redirect("/user/dashboard");
    }

    // --- SAFE DATE PARSING ---
    let year = null;
    let month = null;

    if (monthYear.includes("-")) {
      const parts = monthYear.split("-");
      year = Number(parts[0]);
      month = Number(parts[1]);
    }

    if (!year || !month || month < 1 || month > 12) {
      console.log("IGNORED — Invalid month/year");
      return res.redirect("/user/dashboard");
    }

    // --- Prevent Duplicate Payment for Same Month ---
    const exists = await RentPayment.findOne({
      reservationId,
      month,
      year
    });

    if (exists) {
      console.log("IGNORED — Duplicate rent entry not allowed");
      return res.redirect("/user/dashboard");
    }

    // --- METHOD + SCREENSHOT HANDLING ---
    let screenshot = null;
    let method = req.body.method || "cash"; // Default to cash if missing

    if (method === "online") {
      if (!req.file) {
        console.log("IGNORED — Online payment requires screenshot");
        return res.redirect("/user/dashboard");
      }
      screenshot = "/uploads/" + req.file.filename;
    } else {
      // If cash, ignore any uploaded file (though frontend hides it)
      method = "cash";
    }

    // --- CREATE SAFE PAYMENT ENTRY ---
    await RentPayment.create({
      userId: req.session.user._id,
      reservationId,
      month,
      year,
      amount: Number(amount),
      method,
      screenshot,
      status: "Pending",
      createdAt: new Date()
    });

    return res.redirect("/user/dashboard");

  } catch (error) {
    console.log("Rent Upload Error:", error);
    return res.send("Error uploading receipt: " + error.message);
  }
};
