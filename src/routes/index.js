const express = require("express");

const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const sellerRoutes = require("./seller.routes");

const router = express.Router();

router.use("/", authRoutes);
router.use("/admin", adminRoutes);
router.use("/seller", sellerRoutes);

module.exports = router;
