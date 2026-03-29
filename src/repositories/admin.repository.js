const prisma = require("../config/prismaClient");

const findAdminByEmail = (email) =>
  prisma.admin.findUnique({
    where: { email }
  });

module.exports = {
  findAdminByEmail
};
