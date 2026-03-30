import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  user: "root",
  password: "Admin@123456789$1",
  database: "hospitalmanagementdb",
});

export const prisma = new PrismaClient({ adapter });