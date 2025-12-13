const router = require("express").Router();
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/pricingController");

// Load pricing page
router.get("/", admin, ctrl.getPricing);

// Update pricing
router.post("/", admin, ctrl.updatePricing);

module.exports = router;
