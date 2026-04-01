const env = require('../config/env');

const seedAdmin = require('./seeds/admin.seed');
const seedDemo = require('./seeds/demo.seed');

async function main() {
  console.log("🌱 Starting database seeding...\n");

  if (env.SEED_ADMIN === "true") {
    console.log("👉 Seeding admin...");
    await seedAdmin();
  }

  if (env.SEED_DEMO === "true") {
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