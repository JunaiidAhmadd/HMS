const RentPayment = require("../models/RentPayment");
const Expense = require("../models/Expense");

// Render admin finance page
exports.financePage = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    res.render("admin/reports_finance", { year });
  } catch (err) {
    console.error("Finance Page Render Error:", err);
    return res.status(500).send("Error loading finance page");
  }
};

// Monthly revenue / expense / profit summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    // Revenue from confirmed rent payments
    const rentAgg = await RentPayment.aggregate([
      { $match: { year, status: "Confirmed" } },
      {
        $group: {
          _id: { month: "$month" },
          revenue: { $sum: "$amount" },
        },
      },
    ]);

    // Expenses grouped by month from date
    const startYear = new Date(year, 0, 1);
    const endYear = new Date(year + 1, 0, 1);

    const expenseAgg = await Expense.aggregate([
      { $match: { date: { $gte: startYear, $lt: endYear } } },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          expense: { $sum: "$amount" },
        },
      },
    ]);

    const byMonth = {};

    // Initialize 12 months
    for (let m = 1; m <= 12; m++) {
      byMonth[m] = { year, month: m, revenue: 0, expense: 0, profit: 0 };
    }

    rentAgg.forEach((r) => {
      const m = r._id.month;
      if (byMonth[m]) {
        byMonth[m].revenue = r.revenue;
      }
    });

    expenseAgg.forEach((e) => {
      const m = e._id.month;
      if (byMonth[m]) {
        byMonth[m].expense = e.expense;
      }
    });

    Object.values(byMonth).forEach((m) => {
      m.profit = m.revenue - m.expense;
    });

    const result = Object.values(byMonth);

    return res.json({ success: true, year, data: result });
  } catch (err) {
    console.error("Monthly Summary Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
