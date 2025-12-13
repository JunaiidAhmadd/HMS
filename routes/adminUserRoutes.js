const router = require("express").Router();
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/adminUserController");

// show user list
router.get("/", admin, ctrl.list);

// delete user
router.post("/delete/:id", admin, ctrl.deleteUser);

module.exports = router;
