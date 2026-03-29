const prisma = require("../config/prismaClient");

const findSellerByEmail = (email) =>
  prisma.seller.findUnique({
    where: { email },
    include: {
      sellerSkills: {
        include: {
          skill: true
        }
      }
    }
  });

const findSellerByMobileNo = (mobileNo) =>
  prisma.seller.findUnique({
    where: { mobileNo }
  });

const createSeller = (payload) =>
  prisma.seller.create({
    data: payload,
    include: {
      sellerSkills: {
        include: {
          skill: true
        }
      }
    }
  });

const listSellers = ({ skip, limit }) =>
  prisma.seller.findMany({
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

const countSellers = () => prisma.seller.count();

const createSkillsIfMissing = async (skillNames) => {
  const skillsData = [];

  for (let i = 0; i < skillNames.length; i += 1) {
    skillsData.push({
      name: skillNames[i]
    });
  }

  await prisma.skill.createMany({
    data: skillsData,
    skipDuplicates: true
  });

  return prisma.skill.findMany({
    where: {
      name: {
        in: skillNames
      }
    }
  });
};

module.exports = {
  findSellerByEmail,
  findSellerByMobileNo,
  createSeller,
  listSellers,
  countSellers,
  createSkillsIfMissing
};
