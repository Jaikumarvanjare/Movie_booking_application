require('dotenv').config();

const seedAdmin = require('./seeds/admin.seed');
const seedDemo = require('./seeds/demo.seed');

async function main() {
  console.log("🌱 Starting database seeding...\n");

  if (process.env.SEED_ADMIN === "true") {
    console.log("👉 Seeding admin...");
    await seedAdmin();
  }

  if (process.env.SEED_DEMO === "true") {
    console.log("👉 Seeding demo...");
    await seedDemo();
  }

  console.log("\n🎯 Seeding completed successfully");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  });