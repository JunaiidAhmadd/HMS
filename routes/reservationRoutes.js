const router = require("express").Router();
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/reservationController");

// Show all reservations
router.get("/", admin, ctrl.list);

// Approve
router.post("/:id/approve", admin, ctrl.approve);

// Reject
router.post("/:id/reject", admin, ctrl.reject);

module.exports = router;
