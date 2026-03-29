const ApiError = require("../utils/apiError");
const { hashPassword } = require("../utils/password");
const { getPaginationMeta } = require("../utils/pagination");
const { validateCreateSeller } = require("../utils/validators");
const {
  createSeller,
  createSkillsIfMissing,
  countSellers,
  findSellerByEmail,
  findSellerByMobileNo,
  listSellers
} = require("../repositories/seller.repository");

const createSellerAccount = async ({
  name,
  email,
  mobileNo,
  country,
  state,
  skills,
  password
}) => {
  const sellerSkills = validateCreateSeller({
    name,
    email,
    mobileNo,
    country,
    state,
    skills,
    password
  });
  const sellerEmail = email.toLowerCase();
  const sellerMobileNo = mobileNo;

  if (await findSellerByEmail(sellerEmail)) {
    throw new ApiError(409, "Seller email already exists.");
  }

  if (await findSellerByMobileNo(sellerMobileNo)) {
    throw new ApiError(409, "Seller mobile number already exists.");
  }

  const skillRecords = await createSkillsIfMissing(sellerSkills);
  const hashedPassword = await hashPassword(password);
  const sellerSkillData = [];

  for (let i = 0; i < skillRecords.length; i += 1) {
    sellerSkillData.push({
      skillId: skillRecords[i].id
    });
  }

  const seller = await createSeller({
    name,
    email: sellerEmail,
    mobileNo: sellerMobileNo,
    country,
    state,
    password: hashedPassword,
    role: "SELLER",
    sellerSkills: {
      create: sellerSkillData
    }
  });

  const skillsData = [];

  for (let i = 0; i < seller.sellerSkills.length; i += 1) {
    skillsData.push(seller.sellerSkills[i].skill.name);
  }

  return {
    id: seller.id,
    name: seller.name,
    email: seller.email,
    mobileNo: seller.mobileNo,
    country: seller.country,
    state: seller.state,
    role: seller.role,
    skills: skillsData,
    createdAt: seller.createdAt
  };
};

const getSellerListing = async ({ page, limit, skip }) => {
  const sellers = await listSellers({ skip, limit });
  const total = await countSellers();
  const sellerList = [];

  for (let i = 0; i < sellers.length; i += 1) {
    const skillsData = [];

    for (let j = 0; j < sellers[i].sellerSkills.length; j += 1) {
      skillsData.push(sellers[i].sellerSkills[j].skill.name);
    }

    sellerList.push({
      id: sellers[i].id,
      name: sellers[i].name,
      email: sellers[i].email,
      mobileNo: sellers[i].mobileNo,
      country: sellers[i].country,
      state: sellers[i].state,
      role: sellers[i].role,
      skills: skillsData,
      createdAt: sellers[i].createdAt
    });
  }

  return {
    sellers: sellerList,
    pagination: getPaginationMeta(page, limit, total)
  };
};

module.exports = {
  createSellerAccount,
  getSellerListing
};
