const router = require("express").Router();
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/expenseController");

// Expenses management page (EJS)
router.get("/manage", admin, ctrl.expensePage);

// JSON APIs for expenses
router.post("/", admin, ctrl.createExpense);
router.get("/", admin, ctrl.listExpenses);
router.delete("/:id", admin, ctrl.deleteExpense);

module.exports = router;
