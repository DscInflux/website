import { PrismaClient } from "@prisma/client";

declare global {
    namespace NodeJS {
        interface Global {
            prisma?: PrismaClient;
        }
    }
}

const prismaInstance = globalThis.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"]
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaInstance;

export const prisma = prismaInstance;