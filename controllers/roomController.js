const Room = require("../models/Room");
const Branch = require("../models/Branch");

exports.list = async (req, res) => {
  const branches = await Branch.find();
  const filter = {};

  if (req.query.branchId) filter.branchId = req.query.branchId;

  const rooms = await Room.find(filter).populate("branchId");

  const mapped = rooms.map(r => ({
    _id: r._id,
    branchId: r.branchId ? r.branchId._id : null,
    branchName: r.branchId ? r.branchId.name : "No Branch Assigned",
    type: r.type,
    capacity: r.capacity,
    price: r.price,
    facilities: r.facilities,
    images: r.images
  }));

  res.render("admin/rooms", {
    rooms: mapped,
    branches,
    branchId: req.query.branchId || "",
    success: null,
    error: null
  });
};

exports.create = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => "/uploads/" + f.filename) : [];

    await Room.create({
      branchId: req.body.branchId,
      type: req.body.type,
      capacity: req.body.capacity,
      price: req.body.price,
      facilities: req.body.facilities.split(","),
      images
    });

    res.redirect("/admin/rooms");
  } catch (err) {
    res.send("Room Create Error: " + err.message);
  }
};

exports.update = async (req, res) => {
  try {
    let images = req.body.existingImages ? req.body.existingImages.split(",") : [];

    if (req.files && req.files.length > 0) {
      req.files.forEach(f => images.push("/uploads/" + f.filename));
    }

    await Room.findByIdAndUpdate(req.params.id, {
      branchId: req.body.branchId,
      type: req.body.type,
      capacity: req.body.capacity,
      price: req.body.price,
      facilities: req.body.facilities.split(","),
      images
    });

    res.redirect("/admin/rooms");
  } catch (err) {
    res.send("Room Update Error: " + err.message);
  }
};

exports.delete = async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.redirect("/admin/rooms");
};
