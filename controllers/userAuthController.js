const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register Page
exports.registerPage = (req, res) => {
  res.render("user/register");
};

// Register User
exports.register = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: hashed,
      role: "user"
    });

    res.redirect("/user/login");

  } catch (err) {
    res.send("User Registration Error: " + err.message);
  }
};

// Login Page
exports.loginPage = (req, res) => {
  res.render("user/login");
};

// LOGIN USER  🚀 FIXED
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email, role: "user" });

  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.send("Incorrect password");

  // ✨ store ONLY userId, nothing else.
  req.session.user = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: "user"
  };

  req.session.save(() => {
    res.redirect("/user/dashboard");
  });
};

// LOGOUT USER 🚀 FIXED
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/user/login");
  });
};
