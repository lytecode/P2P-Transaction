require("dotenv").config();

const config = {
  MONGOURI: process.env.MONGOURI,
  PORT: process.env.PORT,
  SENDGRID_USER: process.env.SENDGRID_USER,
  SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD
};

module.exports = config;
