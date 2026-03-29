const { validateAdminLogin, validateSellerLogin } = require("../utils/validators");
const { loginAdmin, loginSeller } = require("../services/auth.service");

const adminLogin = async (req, res, next) => {
  try {
    validateAdminLogin(req.body);
    const result = await loginAdmin(req.body);

    res.status(200).json({
      success: true,
      message: "Admin login successful.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const sellerLogin = async (req, res, next) => {
  try {
    validateSellerLogin(req.body);
    const result = await loginSeller(req.body);

    res.status(200).json({
      success: true,
      message: "Seller login successful.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  sellerLogin
};

