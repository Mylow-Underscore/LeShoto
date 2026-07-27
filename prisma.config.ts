import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  connectionLimit: 5,
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "mysql://leshoto:LeShotoMangaCafe@82.65.202.204:3306/leshotobasedonneeclients",
  },
});