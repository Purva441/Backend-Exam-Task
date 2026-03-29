# Promino Exam Backend

Backend implementation for:

- Admin login
- Create seller
- Seller listing with pagination
- Seller login
- Add product with multiple brands and image upload
- Authenticated seller product listing with pagination
- Product PDF view
- Delete own product

## Tech Stack

- Node.js 22.x
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcrypt
- multer
- pdfkit

## Project Structure

```text
src/
├── config/
├── controllers/
├── repositories/
├── middleware/
├── routes/
├── services/
└── utils/
prisma/
└── schema.prisma
```

## Setup

1. Use Node.js 22.x only

This project is now locked to Node 22.

Examples:

```bash
nvm use 22
```

If dependencies were installed earlier with a broken or partial install, clean them first:

```bash
rmdir /s /q node_modules
del package-lock.json
```

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
```

2. Install dependencies

```bash
npm install
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd install
```

After install, you can verify security issues with:

```bash
npm audit
```

If `npm audit` reports Prisma's transitive `effect` package, this project already pins a patched version through `package.json` `overrides`. Run a clean reinstall so the lockfile picks it up.

3. Create `.env` from `.env.example`

4. Generate Prisma client

```bash
npm run prisma:generate
```

PowerShell alternative:

```bash
npm.cmd run prisma:generate
```

5. Push schema to MySQL database

```bash
npm run prisma:push
```

PowerShell alternative:

```bash
npm.cmd run prisma:push
```

6. Seed default admin

```bash
npm run prisma:seed
```

PowerShell alternative:

```bash
npm.cmd run prisma:seed
```

7. Start server

```bash
npm run dev
```

PowerShell alternative:

```bash
npm.cmd run dev
```

## Default Admin

Default admin credentials come from `.env`:

- Email: `DEFAULT_ADMIN_EMAIL`
- Password: `DEFAULT_ADMIN_PASSWORD`

## API Base URL

```text
http://localhost:5000/api
```

## Main Endpoints

### Admin

- `POST /api/admin/login`
- `POST /api/admin/sellers`
- `GET /api/admin/sellers?page=1&limit=10`

### Seller

- `POST /api/seller/login`
- `POST /api/seller/products`
- `GET /api/seller/products?page=1&limit=10`
- `GET /api/seller/products/:productId/pdf`
- `DELETE /api/seller/products/:productId`

## Product Create Request Format

Use `multipart/form-data`:

- `productName`: string
- `productDescription`: string
- `brands`: JSON string array
- `brandImages`: multiple image files in the same order as brands

Example `brands` value:

```json
[
  {
    "brandName": "Dell",
    "detail": "Test",
    "price": 1000
  },
  {
    "brandName": "HP",
    "detail": "Test",
    "price": 2000
  }
]
```

## Seller Create Request Format

Send JSON:

```json
{
  "name": "Seller One",
  "email": "seller1@example.com",
  "mobileNo": "9876543210",
  "country": "India",
  "state": "Maharashtra",
  "skills": ["Node.js", "Express", "MySQL"],
  "password": "Seller@123"
}
```

## Notes

- Only admin can create and list sellers.
- Only authenticated seller can create, list, view PDF, and delete their own products.
- Uploaded images are stored in `uploads/brands`.
- Product PDF includes product details, all brand details, and total price.
- `package.json`, `.nvmrc`, and `.node-version` are configured for Node.js 22.x.
- Direct dependencies were updated to safer current major/minor versions; run a fresh install to refresh `package-lock.json`.
- Prisma's vulnerable transitive `effect` dependency is patched via `npm overrides` to avoid a forced Prisma 7 upgrade.
- Runtime Node version check script was removed to keep the project simpler; `engines` still documents the expected Node 22 range.
