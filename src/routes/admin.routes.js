const express = require("express");

const { createSeller, getSellers } = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/sellers", authenticate, authorize("ADMIN"), createSeller);
router.get("/sellers", authenticate, authorize("ADMIN"), getSellers);

module.exports = router;
