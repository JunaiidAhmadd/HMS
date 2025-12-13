const router = require("express").Router();
const authUser = require("../middleware/authUser");
const upload = require("../middleware/upload");
const userRentCtrl = require("../controllers/userRentController");

// Only upload route needed
router.post(
  "/rent/upload",
  authUser,
  upload.single("screenshot"),
  userRentCtrl.uploadReceipt
);

module.exports = router;
