const router = require("express").Router();
const upload = require("../utils/multer");
const admin = require("../middleware/authAdmin");
const ctrl = require("../controllers/roomController");

// Get rooms page
router.get("/", admin, ctrl.list);

// Create room
router.post("/create", admin, upload.array("images"), ctrl.create);

// Update room
router.put("/:id", admin, upload.array("images"), ctrl.update);
router.post("/:id/update", admin, upload.array("images"), ctrl.update);

// Delete room
router.post("/:id/delete", admin, ctrl.delete);

module.exports = router;
