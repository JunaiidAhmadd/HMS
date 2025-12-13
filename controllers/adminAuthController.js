const bcrypt = require("bcryptjs");
const User = require("../models/User");

// REGISTER PAGE
exports.registerPage = (req, res) => {
  res.render("admin/login", { mode: "register" });
};

// REGISTER ADMIN
exports.register = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: hashed,
      role: "admin"
    });

    res.redirect("/admin/login");

  } catch (err) {
    res.send("Admin Registration Error: " + err.message);
  }
};

// LOGIN PAGE
exports.loginPage = (req, res) => {
  res.render("admin/login", { mode: "login" });
};

// LOGIN ADMIN 🚀 FIXED
exports.login = async (req, res) => {
  const admin = await User.findOne({ email: req.body.email, role: "admin" });

  if (!admin) return res.send("Admin not found");

  const match = await bcrypt.compare(req.body.password, admin.password);
  if (!match) return res.send("Incorrect password");

  req.session.user = {
    id: admin._id,
    role: "admin"
  };

  req.session.save(() => {
    res.redirect("/admin/dashboard");
  });
};

// LOGOUT ADMIN 🚀 FIXED
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/admin/login");
  });
};
