const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "replace_with_strong_secret_key";

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authorization token is required."));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token."));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You are not authorized to access this resource."));
  }

  return next();
};

module.exports = {
  authenticate,
  authorize
};
