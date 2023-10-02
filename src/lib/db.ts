// import { PrismaClient } from "@prisma/client"

// const prismaClientSingleton = () => {
//     return new PrismaClient()
// }

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// const globalForPrisma = globalThis as unknown as {
//     prisma: PrismaClientSingleton | undefined
// }

// const db = globalForPrisma.prisma ?? prismaClientSingleton()

// export default db

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
}

const db = globalThis.prisma || new PrismaClient()

export default db

if (process.env.NODE_ENV !== "production") globalThis.prisma = db
