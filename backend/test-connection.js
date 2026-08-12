require("dotenv").config(); // ← Add this at the very top!

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to database successfully");

    // Department count
    const deptCount = await prisma.departments.count();
    console.log(`📊 Departments Count: ${deptCount}`);

    // Employee count
    const employeeCount = await prisma.employees.count();
    console.log(`📊 Employees Count: ${employeeCount}`);

    // Get all employees with their departments
    const employees = await prisma.employees.findMany({
      include: {
        departments: true,
      },
    });

    console.log("\n📋 All Employees:");
    if (employees.length === 0) {
      console.log("  No employees found in the database");
    } else {
      employees.forEach((emp) => {
        console.log(
          `  - ${emp.name} (${emp.position || "No position"}) - ${emp.departments?.name || "No Department"}`,
        );
      });
      console.log("\nFull data:");
      console.log(JSON.stringify(employees, null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error);
    if (error.code === "P1001") {
      console.error(
        "💡 Can't reach database. Check if PostgreSQL is running and DATABASE_URL is correct.",
      );
    }
    if (error.code === "P2021") {
      console.error("💡 Table doesn't exist. Run: npx prisma db push");
    }
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Disconnected from database");
  }
}

main();
