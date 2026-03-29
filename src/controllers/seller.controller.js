const { getPagination } = require("../utils/pagination");
const { validateNumericId } = require("../utils/validators");
const {
  createSellerProduct,
  deleteSellerProduct,
  generateProductPdf,
  getSellerProductPdfData,
  getSellerProducts
} = require("../services/seller.service");

const addProduct = async (req, res, next) => {
  try {
    const product = await createSellerProduct({
      sellerId: req.user.id,
      productName: req.body.productName,
      productDescription: req.body.productDescription,
      brands: req.body.brands,
      files: req.files || []
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const listProducts = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await getSellerProducts({
      sellerId: req.user.id,
      page: pagination.page,
      limit: pagination.limit,
      skip: pagination.skip
    });

    res.status(200).json({
      success: true,
      message: "Product list fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const viewProductPdf = async (req, res, next) => {
  try {
    const productId = validateNumericId(req.params.productId, "Product ID");
    const product = await getSellerProductPdfData({
      sellerId: req.user.id,
      productId
    });

    generateProductPdf({ product, res });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = validateNumericId(req.params.productId, "Product ID");
    await deleteSellerProduct({
      sellerId: req.user.id,
      productId
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  listProducts,
  viewProductPdf,
  deleteProduct
};
