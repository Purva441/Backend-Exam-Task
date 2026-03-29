const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy"
  });
});

app.use("/api", routes);
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});
app.use(errorHandler);

module.exports = app;
