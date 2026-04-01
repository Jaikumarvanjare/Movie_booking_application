const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "DATABASE_URL",
  "AUTH_KEY",
  "NOTI_SERVICE"
];

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
});

module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,

  AUTH_KEY: process.env.AUTH_KEY,

  NOTI_SERVICE: process.env.NOTI_SERVICE,

  SEED_ADMIN: process.env.SEED_ADMIN,
  SEED_DEMO: process.env.SEED_DEMO,

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  DEMO_PASSWORD: process.env.DEMO_PASSWORD
};