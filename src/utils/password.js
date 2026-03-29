const bcrypt = require("bcrypt");

const hashPassword = (value) => bcrypt.hash(value, 10);
const comparePassword = (plainValue, hashedValue) => bcrypt.compare(plainValue, hashedValue);

module.exports = {
  hashPassword,
  comparePassword
};

