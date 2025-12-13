const router = require("express").Router();
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/adminDashboardController");
const reportCtrl = require("../controllers/reportController");

// ADMIN DASHBOARD PAGE
router.get("/dashboard", admin, ctrl.dashboard);

// ADMIN FINANCE PAGE
router.get("/reports/finance", admin, reportCtrl.financePage);

module.exports = router;
