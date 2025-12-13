const router = require("express").Router();
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/reportController");

// Finance page (EJS)
router.get("/finance", admin, ctrl.financePage);

// Monthly summary: revenue, expense, profit (JSON)
router.get("/monthly", admin, ctrl.getMonthlySummary);

module.exports = router;
