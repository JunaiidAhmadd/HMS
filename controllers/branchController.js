const Branch = require("../models/Branch");

exports.list = async (req, res) => {
  const branches = await Branch.find();
  res.render("admin/branches", { branches });
};

exports.create = async (req, res) => {
  try {
    let photos = [];
    if (req.files) photos = req.files.map(f => "/uploads/" + f.filename);

    await Branch.create({
      name: req.body.name,
      address: req.body.address,
      facilities: req.body.facilities.split(","),
      photos
    });

    res.redirect("/admin/branches");
  } catch (err) {
    res.send("Branch Error: " + err.message);
  }
};

exports.update = async (req, res) => {
  try {
    let photos = req.body.existingPhotos ? req.body.existingPhotos.split(",") : [];

    if (req.files && req.files.length > 0) {
      req.files.forEach(f => photos.push("/uploads/" + f.filename));
    }

    await Branch.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      address: req.body.address,
      facilities: req.body.facilities.split(","),
      photos
    });

    res.redirect("/admin/branches");
  } catch (err) {
    res.send("Branch Update Error: " + err.message);
  }
};

exports.delete = async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.redirect("/admin/branches");
};
