require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require("method-override");

require("./utils/db");

const app = express();

// -----------------------
// CORE MIDDLEWARE
// -----------------------
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(require("morgan")("dev"));

// Static folders
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// -----------------------
// SESSION STORE (FIXED 💯)
// -----------------------
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", function (err) {
  console.error("❌ SESSION STORE ERROR:", err);
});

// SESSION MIDDLEWARE
app.use(
  session({
    secret: process.env.SESSION_SECRET || "HMS_SECRET_KEY_12345",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: false, // set true only if https
    },
  })
);

// Make session available in EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// -----------------------
// VIEW ENGINE
// -----------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -----------------------
// ADMIN ROUTES
// -----------------------
app.use("/admin", require("./routes/adminAuthRoutes"));
app.use("/admin/branches", require("./routes/branchRoutes"));
app.use("/admin/rooms", require("./routes/roomRoutes"));
// Pricing management removed from admin panel
app.use("/admin/reservations", require("./routes/reservationRoutes"));
app.use("/admin/users", require("./routes/adminUserRoutes"));
app.use("/admin/residents", require("./routes/residentRoutes"));
app.use("/admin/expenses", require("./routes/expenseRoutes"));
app.use("/admin/reports", require("./routes/reportRoutes"));
app.use("/admin", require("./routes/adminDashboardRoutes"));

// -----------------------
// USER ROUTES
// -----------------------
app.use("/user", require("./routes/userAuthRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/user", require("./routes/userRentRoutes"));

// -----------------------
// DEFAULT ROUTE
// -----------------------
app.get("/", (req, res) => res.redirect("/user/home"));

// -----------------------
// SERVER START
// -----------------------
app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on PORT", process.env.PORT || 5000);
});
