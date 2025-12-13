const router = require("express").Router();
const upload = require("../utils/multer");
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/branchController");

// List branches
router.get("/", admin, ctrl.list);

// Add branch
router.post("/create", admin, upload.array("photos"), ctrl.create);

// Edit branch
router.post("/:id/update", admin, upload.array("photos"), ctrl.update);

// Delete branch
router.post("/:id/delete", admin, ctrl.delete);

module.exports = router;
