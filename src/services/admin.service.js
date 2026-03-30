const ApiError = require("../utils/apiError");
const prisma = require("../config/prismaClient");
const { hashPassword } = require("../utils/password");
const { getPaginationMeta } = require("../utils/pagination");
const { validateCreateSeller } = require("../utils/validators");

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

  const sellerByEmail = await prisma.seller.findUnique({
    where: { email: sellerEmail }
  });

  if (sellerByEmail) {
    throw new ApiError(409, "Seller email already exists.");
  }

  const sellerByMobileNo = await prisma.seller.findUnique({
    where: { mobileNo: sellerMobileNo }
  });

  if (sellerByMobileNo) {
    throw new ApiError(409, "Seller mobile number already exists.");
  }

  const skillsData = [];

  for (let i = 0; i < sellerSkills.length; i += 1) {
    skillsData.push({
      name: sellerSkills[i]
    });
  }

  await prisma.skill.createMany({
    data: skillsData,
    skipDuplicates: true
  });

  const skillRecords = await prisma.skill.findMany({
    where: {
      name: {
        in: sellerSkills
      }
    }
  });

  const hashedPassword = await hashPassword(password);
  const sellerSkillsData = [];

  for (let i = 0; i < skillRecords.length; i += 1) {
    sellerSkillsData.push({
      skillId: skillRecords[i].id
    });
  }

  const seller = await prisma.seller.create({
    data: {
      name,
      email: sellerEmail,
      mobileNo: sellerMobileNo,
      country,
      state,
      password: hashedPassword,
      role: "SELLER",
      sellerSkills: {
        create: sellerSkillsData
      }
    },
    include: {
      sellerSkills: {
        include: {
          skill: true
        }
      }
    }
  });

  const sellerSkillNames = [];

  for (let i = 0; i < seller.sellerSkills.length; i += 1) {
    sellerSkillNames.push(seller.sellerSkills[i].skill.name);
  }

  return {
    id: seller.id,
    name: seller.name,
    email: seller.email,
    mobileNo: seller.mobileNo,
    country: seller.country,
    state: seller.state,
    role: seller.role,
    skills: sellerSkillNames,
    createdAt: seller.createdAt
  };
};

const getSellerListing = async ({ page, limit, skip }) => {
  const sellers = await prisma.seller.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      sellerSkills: {
        include: {
          skill: true
        }
      }
    }
  });
  const total = await prisma.seller.count();
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
