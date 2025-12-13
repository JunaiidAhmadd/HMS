const router = require("express").Router();
const ctrl = require("../controllers/userAuthController");

// User Register
router.get("/register", ctrl.registerPage);
router.post("/register", ctrl.register);

// User Login
router.get("/login", ctrl.loginPage);
router.post("/login", ctrl.login);

// Logout
router.get("/logout", ctrl.logout);

module.exports = router;
