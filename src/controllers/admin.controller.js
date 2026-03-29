const { getPagination } = require("../utils/pagination");
const { createSellerAccount, getSellerListing } = require("../services/admin.service");

const createSeller = async (req, res, next) => {
  try {
    const seller = await createSellerAccount(req.body);

    res.status(201).json({
      success: true,
      message: "Seller created successfully.",
      data: seller
    });
  } catch (error) {
    next(error);
  }
};

const getSellers = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await getSellerListing(pagination);

    res.status(200).json({
      success: true,
      message: "Seller list fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSeller,
  getSellers
};
