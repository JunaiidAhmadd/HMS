module.exports = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "user") {
    return res.redirect("/user/login");
  }
  next();
};
