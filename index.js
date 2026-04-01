require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("\n=================================");
  console.log("🚀 Server started successfully");
  console.log(`🌍 http://localhost:${PORT}`);
  console.log("=================================\n");

  console.log("📄 API Docs:");
  console.log(`👉 http://localhost:${PORT}/api-docs\n`);

  console.log("🗄 Database Commands:");
  console.log("---------------------------------");
  console.log("👉 npm run db:push       → Push schema to DB");
  console.log("👉 npm run db:generate   → Generate Prisma client");
  console.log("👉 npm run db:studio     → Open Prisma Studio");
  console.log("👉 npm run db:reset      → Reset DB + Seed\n");

  console.log("🌱 Seeding Commands:");
  console.log("---------------------------------");
  console.log("👉 npm run seed          → Run all seeds");
  console.log("👉 npm run seed:admin    → Seed admin only");
  console.log("👉 npm run seed:demo     → Seed demo data\n");

  console.log("🛠 Utility Commands:");
  console.log("---------------------------------");
  console.log("👉 npm run clean         → Remove node_modules");
  console.log("👉 npm run reinstall     → Fresh install dependencies\n");

  console.log("💡 Notes:");
  console.log("---------------------------------");
  console.log("✔ Seeding is idempotent (safe to re-run)");
  console.log("✔ Demo seeding disabled in production");
  console.log("✔ Environment variables loaded from .env\n");
});