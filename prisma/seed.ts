import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const db = new PrismaClient({
  adapter,
});

async function main() {
  await db.grantCycle.upsert({
    where: { id: "vidarbha-2026" },
    update: {
      name: "Vidarbha First-Generation Education Grant",
      description:
        "₹15,000 education support for first-generation college students across Vidarbha.",
      maxSlots: 60,
      active: true,
    },
    create: {
      id: "vidarbha-2026",
      name: "Vidarbha First-Generation Education Grant",
      description:
        "₹15,000 education support for first-generation college students across Vidarbha.",
      maxSlots: 60,
      active: true,
    },
  });

  console.log("Grant cycle ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });