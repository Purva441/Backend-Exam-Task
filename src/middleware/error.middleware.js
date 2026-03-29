const ApiError = require("../utils/apiError");

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: "Unexpected file upload field."
    });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Uploaded image size must not exceed 5 MB."
    });
  }

  if (error.message === "Only image files are allowed.") {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A record with the same unique value already exists."
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Requested record was not found."
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error."
  });
};

module.exports = {
  errorHandler
};
