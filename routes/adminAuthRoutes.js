const router = require("express").Router();
const ctrl = require("../controllers/adminAuthController");

// Admin Register
router.get("/register", ctrl.registerPage);
router.post("/register", ctrl.register);

// Admin Login
router.get("/login", ctrl.loginPage);
router.post("/login", ctrl.login);

// Logout
router.get("/logout", ctrl.logout);

// Change Password
const passwordCtrl = require("../controllers/adminPasswordController");
const admin = require("../middleware/authAdmin");
router.get("/change-password", admin, passwordCtrl.changePasswordPage);
router.post("/change-password", admin, passwordCtrl.changePassword);

module.exports = router;
