const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prismaClient");
const { comparePassword } = require("../utils/password");

const jwtSecret = process.env.JWT_SECRET || "replace_with_strong_secret_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

const loginAdmin = async ({ email, password }) => {
  const adminEmail = email.toLowerCase();
  const admin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  });

  if (!admin) {
    throw new ApiError(401, "Invalid admin credentials.");
  }

  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid admin credentials.");
  }

  const tokenData = {
    id: admin.id,
    email: admin.email,
    role: admin.role
  };

  const token = jwt.sign(tokenData, jwtSecret, {
    expiresIn: jwtExpiresIn
  });

  return {
    accessToken: token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  };
};

const loginSeller = async ({ email, password }) => {
  const sellerEmail = email.toLowerCase();
  const seller = await prisma.seller.findUnique({
    where: { email: sellerEmail }
  });

  if (!seller) {
    throw new ApiError(401, "Invalid seller credentials.");
  }

  const isPasswordValid = await comparePassword(password, seller.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid seller credentials.");
  }

  const tokenData = {
    id: seller.id,
    email: seller.email,
    role: seller.role
  };

  const token = jwt.sign(tokenData, jwtSecret, {
    expiresIn: jwtExpiresIn
  });

  return {
    accessToken: token,
    user: {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      role: seller.role
    }
  };
};

module.exports = {
  loginAdmin,
  loginSeller
};
