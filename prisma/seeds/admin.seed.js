require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { USER_ROLE, USER_STATUS } = require('../../utils/constants');

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
      userRole: USER_ROLE.admin,
      userStatus: USER_STATUS.approved
    }
  });

  console.log("✅ Admin seeded");
}

module.exports = seedAdmin;