const ApiError = require("./apiError");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobileNo = (mobileNo) => /^\+?[0-9]{7,15}$/.test(mobileNo);

const validateAdminLogin = ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }
};

const normalizeSkillNames = (skills) => {
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new ApiError(400, "Skills must be a non-empty array.");
  }

  const uniqueSkills = [
    ...new Set(
      skills
        .map((skill) => String(skill || "").trim())
        .filter(Boolean)
    )
  ];

  if (uniqueSkills.length === 0) {
    throw new ApiError(400, "At least one valid skill is required.");
  }

  return uniqueSkills;
};

const validateCreateSeller = ({ name, email, mobileNo, country, state, skills, password }) => {
  if (!name || !email || !mobileNo || !country || !state || !password) {
    throw new ApiError(400, "Name, email, mobile number, country, state, skills, and password are required.");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid seller email address.");
  }

  if (!isValidMobileNo(mobileNo)) {
    throw new ApiError(400, "Please provide a valid mobile number.");
  }

  if (String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  return normalizeSkillNames(skills);
};

const validateSellerLogin = ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }
};

const parseAndValidateBrands = (brandsPayload) => {
  let brands = brandsPayload;

  if (typeof brandsPayload === "string") {
    try {
      brands = JSON.parse(brandsPayload);
    } catch (error) {
      throw new ApiError(400, "Brands must be valid JSON.");
    }
  }

  if (!Array.isArray(brands) || brands.length === 0) {
    throw new ApiError(400, "At least one brand is required.");
  }

  const validBrands = [];

  for (let index = 0; index < brands.length; index += 1) {
    const brand = brands[index];
    const brandName = String(brand.brandName || "").trim();
    const detail = String(brand.detail || "").trim();
    const price = Number(brand.price);

    if (!brandName || !detail || Number.isNaN(price) || price < 0) {
      throw new ApiError(400, `Invalid brand data at position ${index + 1}.`);
    }

    validBrands.push({
      brandName,
      detail,
      price: Number(price.toFixed(2))
    });
  }

  return validBrands;
};

const validateCreateProduct = ({ productName, productDescription, brands, files }) => {
  if (!productName || !productDescription) {
    throw new ApiError(400, "Product name and product description are required.");
  }

  const validBrands = parseAndValidateBrands(brands);

  if (!Array.isArray(files) || files.length !== validBrands.length) {
    throw new ApiError(400, "Please upload one image for each brand.");
  }

  return validBrands;
};

const validateNumericId = (value, fieldName) => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw new ApiError(400, `${fieldName} must be a valid positive number.`);
  }

  return numericValue;
};

module.exports = {
  validateAdminLogin,
  validateCreateSeller,
  validateSellerLogin,
  validateCreateProduct,
  validateNumericId,
  parseAndValidateBrands,
  normalizeSkillNames
};
