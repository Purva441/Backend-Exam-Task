const express = require("express");

const { addProduct, listProducts, viewProductPdf, deleteProduct } = require("../controllers/seller.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { uploadBrandImages } = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/products", authenticate, authorize("SELLER"), uploadBrandImages, addProduct);
router.get("/products", authenticate, authorize("SELLER"), listProducts);
router.get("/products/:productId/pdf", authenticate, authorize("SELLER"), viewProductPdf);
router.delete("/products/:productId", authenticate, authorize("SELLER"), deleteProduct);

module.exports = router;
