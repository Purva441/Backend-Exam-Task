const prisma = require("../config/prismaClient");

const createProduct = (payload) =>
  prisma.product.create({
    data: payload,
    include: {
      brands: true
    }
  });

const listSellerProducts = ({ sellerId, skip, limit }) =>
  prisma.product.findMany({
    where: { sellerId },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      brands: true
    }
  });

const countSellerProducts = (sellerId) =>
  prisma.product.count({
    where: { sellerId }
  });

const findProductByIdAndSeller = (productId, sellerId) =>
  prisma.product.findFirst({
    where: {
      id: productId,
      sellerId
    },
    include: {
      brands: true
    }
  });

const deleteProductById = (id) =>
  prisma.product.delete({
    where: { id }
  });

module.exports = {
  createProduct,
  listSellerProducts,
  countSellerProducts,
  findProductByIdAndSeller,
  deleteProductById
};
