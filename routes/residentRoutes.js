const router = require("express").Router();
const admin = require("../middleware/authAdmin");

// Controllers
const ctrl = require("../controllers/residentController");
const overdueCtrl = require("../controllers/overdueController");

router.get("/", admin, ctrl.listResidents);


router.get("/:id/payments", admin, ctrl.viewPayments);

router.post("/:reservationId/payments/:paymentId/confirm", admin, ctrl.confirmPayment);

router.post("/payments/add-cash", admin, ctrl.addCashPayment);

router.get("/overdue/list", admin, async (req, res) => {
  try {
    await overdueCtrl.getOverdueList(req, res);
  } catch (err) {
    console.error("🔥 OVERDUE LIST ROUTE ERROR:", err);

 
    if (req.xhr || req.headers.accept.includes("application/json")) {
      return res.status(500).json({ success: false, message: err.message });
    }


    return res.status(500).send("Server Error in overdue list route.");
  }
});

router.post("/overdue/mark-paid", admin, async (req, res) => {
  try {
    await overdueCtrl.markAsPaid(req, res);
  } catch (err) {
    console.error("🔥 MARK PAID ROUTE ERROR:", err);


    if (req.xhr || req.headers.accept.includes("application/json")) {
      return res.status(500).json({ success: false, message: err.message });
    }

    return res.redirect("/admin/residents");
  }
});

module.exports = router;
