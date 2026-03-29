const express = require("express");

const { adminLogin, sellerLogin } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/seller/login", sellerLogin);

module.exports = router;

