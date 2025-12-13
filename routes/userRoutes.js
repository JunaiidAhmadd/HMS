const router = require("express").Router();
const Branch = require("../models/Branch");
const Room = require("../models/Room");
const authUser = require("../middleware/authUser");
const Pricing = require("../models/Pricing");
const reservationCtrl = require("../controllers/reservationController");
const userDashboardCtrl = require("../controllers/userDashboardController");

// Home page
router.get('/home', async (req, res) => {
  const pricing = await Pricing.findOne();
  const branches = await Branch.find();
  res.render("user/home", { pricing, branches });
});

// Show Branch Page
router.get("/branch", async (req, res) => {
  const branch = await Branch.findById(req.query.id);
  const rooms = await Room.find({ branchId: req.query.id });
  res.render("user/branch", { branch, rooms });
});

// Show Room Details Page
router.get("/room/:id", async (req, res) => {
  const room = await Room.findById(req.params.id).populate("branchId");
  res.render("user/room", {
    room: {
      ...room.toObject(),
      branch: room.branchId
    }
  });
});

// Reservation Form (Protected)
router.get("/reservation", authUser, reservationCtrl.form);

// Create Reservation (Protected)
router.post("/reservation", authUser, reservationCtrl.create);

// User Dashboard (Protected)
router.get("/dashboard", authUser, userDashboardCtrl.dashboard);

// Delete Reservation (Protected)
router.post("/reservations/:id/delete", authUser, reservationCtrl.delete);

module.exports = router;
