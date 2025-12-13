const User = require("../models/User");

const Branch = require("../models/Branch");
const Reservation = require("../models/Reservation");

exports.list = async (req, res) => {
  try {
    const branches = await Branch.find();
    let filter = { role: "user" };

    if (req.query.branch) {
      // Find reservations for this branch
      const reservations = await Reservation.find({ branchId: req.query.branch }).select("userId");
      const userIds = reservations.map(r => r.userId);

      // Add to filter
      filter._id = { $in: userIds };
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.render("admin/users", {
      users,
      branches,
      selectedBranch: req.query.branch || ""
    });
  } catch (err) {
    console.log("User List Error:", err);
    res.send("Error fetching users");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("Attempting to delete user:", req.params.id);
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    console.log("Deleted User result:", deletedUser);
    res.redirect("/admin/users");
  } catch (err) {
    console.log("Delete User Error:", err);
    res.send("Failed to delete user");
  }
};
