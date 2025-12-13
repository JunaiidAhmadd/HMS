const Pricing = require("../models/Pricing");

exports.getPricing = async (req, res) => {
  let pricing = await Pricing.findOne();
  if (!pricing) {
    pricing = await Pricing.create({
      single: 8000,
      double: 14000,
      three: 18000,
      four: 22000,
      five: 25000,
      six: 28000,
      seven: 30000
    });
  }
  res.render("admin/pricing", { pricing });
};

exports.updatePricing = async (req, res) => {
  const pricing = await Pricing.findOne();

  pricing.single = req.body.single;
  pricing.double = req.body.double;
  pricing.three = req.body.three;
  pricing.four = req.body.four;
  pricing.five = req.body.five;
  pricing.six = req.body.six;
  pricing.seven = req.body.seven;

  await pricing.save();
  res.redirect("/admin/pricing");
};
