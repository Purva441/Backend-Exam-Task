const path = require("path");
const PDFDocument = require("pdfkit");

const ApiError = require("../utils/apiError");
const prisma = require("../config/prismaClient");
const { validateCreateProduct } = require("../utils/validators");

const createSellerProduct = async ({
  sellerId,
  productName,
  productDescription,
  brands,
  files
}) => {
  const validBrands = validateCreateProduct({
    productName,
    productDescription,
    brands,
    files
  });

  const brandData = [];

  for (let i = 0; i < validBrands.length; i += 1) {
    brandData.push({
      brandName: validBrands[i].brandName,
      detail: validBrands[i].detail,
      price: validBrands[i].price,
      imagePath: `/uploads/brands/${files[i].filename}`,
      imageOriginalName: files[i].originalname
    });
  }

  const product = await prisma.product.create({
    data: {
      productName: productName.trim(),
      productDescription: productDescription.trim(),
      sellerId,
      brands: {
        create: brandData
      }
    },
    include: {
      brands: true
    }
  });

  const productBrands = [];
  let totalPrice = 0;

  for (let i = 0; i < product.brands.length; i += 1) {
    productBrands.push({
      id: product.brands[i].id,
      brandName: product.brands[i].brandName,
      detail: product.brands[i].detail,
      imagePath: product.brands[i].imagePath,
      price: Number(product.brands[i].price)
    });

    totalPrice += Number(product.brands[i].price);
  }

  return {
    id: product.id,
    productName: product.productName,
    productDescription: product.productDescription,
    sellerId: product.sellerId,
    brands: productBrands,
    totalPrice: Number(totalPrice.toFixed(2)),
    pdfUrl: `/api/seller/products/${product.id}/pdf`,
    createdAt: product.createdAt
  };
};

const getSellerProducts = async ({ sellerId, page, limit, skip }) => {
  const products = await prisma.product.findMany({
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
  const total = await prisma.product.count({
    where: { sellerId }
  });
  const sellerProducts = [];
  let totalPages = Math.ceil(total / limit);

  if (totalPages === 0) {
    totalPages = 1;
  }

  for (let i = 0; i < products.length; i += 1) {
    const productBrands = [];
    let totalPrice = 0;

    for (let j = 0; j < products[i].brands.length; j += 1) {
      productBrands.push({
        id: products[i].brands[j].id,
        brandName: products[i].brands[j].brandName,
        detail: products[i].brands[j].detail,
        imagePath: products[i].brands[j].imagePath,
        price: Number(products[i].brands[j].price)
      });

      totalPrice += Number(products[i].brands[j].price);
    }

    sellerProducts.push({
      id: products[i].id,
      productName: products[i].productName,
      productDescription: products[i].productDescription,
      sellerId: products[i].sellerId,
      brands: productBrands,
      totalPrice: Number(totalPrice.toFixed(2)),
      pdfUrl: `/api/seller/products/${products[i].id}/pdf`,
      createdAt: products[i].createdAt
    });
  }

  return {
    products: sellerProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};

const getSellerProductPdfData = async ({ sellerId, productId }) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      sellerId
    },
    include: {
      brands: true
    }
  });

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const productBrands = [];
  let totalPrice = 0;

  for (let i = 0; i < product.brands.length; i += 1) {
    productBrands.push({
      id: product.brands[i].id,
      brandName: product.brands[i].brandName,
      detail: product.brands[i].detail,
      imagePath: product.brands[i].imagePath,
      price: Number(product.brands[i].price)
    });

    totalPrice += Number(product.brands[i].price);
  }

  return {
    id: product.id,
    productName: product.productName,
    productDescription: product.productDescription,
    sellerId: product.sellerId,
    brands: productBrands,
    totalPrice: Number(totalPrice.toFixed(2)),
    pdfUrl: `/api/seller/products/${product.id}/pdf`,
    createdAt: product.createdAt
  };
};

const generateProductPdf = ({ product, res }) => {
  const document = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=product-${product.id}.pdf`);

  document.pipe(res);

  document.fontSize(18).text("Product Details");
  document.moveDown();
  document.fontSize(12).text(`Product Name: ${product.productName}`);
  document.fontSize(12).text(`Description: ${product.productDescription}`);
  document.moveDown();

  for (let index = 0; index < product.brands.length; index += 1) {
    const brand = product.brands[index];
    document.fontSize(12).text(`Brand ${index + 1}`);
    document.fontSize(12).text(`Brand Name: ${brand.brandName}`);
    document.text(`Price: ${brand.price}`);

    const absoluteImagePath = path.join(
      process.cwd(),
      brand.imagePath.startsWith("/") ? brand.imagePath.slice(1) : brand.imagePath
    );

    try {
      document.image(absoluteImagePath, { fit: [150, 100] });
    } catch (error) {
      document.text("Brand Image: Not available");
    }

    document.moveDown();
  }

  document.fontSize(12).text(`Total Price: ${product.totalPrice}`);

  document.end();
};

const deleteSellerProduct = async ({ sellerId, productId }) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      sellerId
    }
  });

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  await prisma.product.delete({
    where: { id: product.id }
  });
};

module.exports = {
  createSellerProduct,
  getSellerProducts,
  getSellerProductPdfData,
  generateProductPdf,
  deleteSellerProduct
};
