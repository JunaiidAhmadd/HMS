const Reservation = require("../models/Reservation");
const Branch = require("../models/Branch");
const Room = require("../models/Room");
const Pricing = require("../models/Pricing");


// Show Reservation Form
exports.form = async (req, res) => {
  const branches = await Branch.find();
  const rooms = await Room.find();

  let roomsByBranch = {};
  rooms.forEach(r => {
    const bid = r.branchId.toString();
    if (!roomsByBranch[bid]) roomsByBranch[bid] = [];
    if (!roomsByBranch[bid].includes(r.type)) {
      roomsByBranch[bid].push(r.type);
    }
  });

  // Fetch fresh user data if logged in
  let user = null;
  if (req.session.user) {
    const User = require("../models/User");
    user = await User.findById(req.session.user._id);
  }

  // Debugging Room Population
  console.log("--- DEBUG RESERVATION ---");
  console.log("Total Rooms:", rooms.length);
  console.log("Rooms:", rooms.map(r => ({ branchId: r.branchId ? r.branchId.toString() : 'NULL', type: r.type })));
  console.log("Branches:", branches.map(b => ({ id: b._id.toString(), name: b.name })));
  console.log("RoomsByBranch:", JSON.stringify(roomsByBranch, null, 2));

  res.render("user/reservation", { branches, roomsByBranch, user });
};


// Create Reservation
exports.create = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/user/login");

    // Find a room of this type in this branch to get the price
    const room = await Room.findOne({
      branchId: req.body.branchId,
      type: req.body.roomType
    });

    if (!room) {
      return res.send("Error: Room type not found in this branch.");
    }

    const price = room.price;

    await Reservation.create({
      userId: req.session.user._id,

      // Auto-fill logged in user info
      fullName: req.session.user.fullName,
      email: req.session.user.email,
      phone: req.session.user.phone,

      // Form values
      cnic: req.body.cnic,
      occupation: req.body.occupation,
      studentId: req.body.studentId,
      semester: req.body.semester,
      institute: req.body.institute,

      branchId: req.body.branchId,
      roomType: req.body.roomType,
      occupants: req.body.occupants,
      durationMonths: req.body.durationMonths,

      startDate: new Date(req.body.startDate),
      notes: req.body.notes,

      price
    });

    return res.redirect("/user/dashboard");

  } catch (err) {
    console.log("Reservation Error:", err);
    return res.send("Error: " + err.message);
  }
};



// =========================
//   ADMIN VIEW (UPDATED)
//   Newest First Sorting
// =========================
exports.list = async (req, res) => {
  const branches = await Branch.find();
  const reservations = await Reservation.find()
    .sort({ createdAt: -1 })   // 🔥 NEWEST FIRST
    .populate("branchId", "name");

  const mapped = reservations.map(r => ({
    ...r.toObject(),
    branchName: r.branchId?.name || "Unknown"
  }));

  res.render("admin/reservations", { reservations: mapped, branches });
};



// Approve
exports.approve = async (req, res) => {
  await Reservation.findByIdAndUpdate(req.params.id, { status: "Approved" });
  res.redirect("/admin/reservations");
};


// Reject
exports.reject = async (req, res) => {
  await Reservation.findByIdAndUpdate(req.params.id, { status: "Rejected" });
  res.redirect("/admin/reservations");
};

// Delete (User-side)
exports.delete = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    // Prevent deletion of approved reservations
    if (reservation && reservation.status === "Approved") {
      console.log("Cannot delete approved reservation");
      return res.redirect("/user/dashboard");
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect("/user/dashboard");
  } catch (err) {
    console.log("Delete Reservation Error:", err);
    res.redirect("/user/dashboard");
  }
};
