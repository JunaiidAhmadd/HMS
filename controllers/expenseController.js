const Expense = require("../models/Expense");

// Render expenses management page
exports.expensePage = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    res.render("admin/expenses", { year });
  } catch (err) {
    console.error("Expense Page Render Error:", err);
    return res.status(500).send("Error loading expenses page");
  }
};

// Add new expense (Admin)
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: "Title and amount are required" });
    }

    const expense = await Expense.create({
      title,
      amount: Number(amount),
      date: date ? new Date(date) : undefined,
      category: category || null,
      addedBy: req.session && req.session.admin ? req.session.admin._id : null,
    });

    return res.json({ success: true, expense });
  } catch (err) {
    console.error("Create Expense Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// List expenses (optionally filter by month/year)
exports.listExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;

    const filter = {};

    if (month && year) {
      const m = Number(month);
      const y = Number(year);

      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 1);

      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 }).lean();

    return res.json({ success: true, expenses });
  } catch (err) {
    console.error("List Expenses Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete expense (soft-simple hard delete)
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await Expense.findByIdAndDelete(id);

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete Expense Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
