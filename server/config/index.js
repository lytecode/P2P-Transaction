require("dotenv").config();

const config = {
  MONGOURI: process.env.MONGOURI,
  PORT: process.env.PORT,
  SENDGRID_USER: process.env.SENDGRID_USER,
  SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  TOKEN_EXPIRESIN: process.env.TOKEN_EXPIRESIN
};

module.exports = config;
