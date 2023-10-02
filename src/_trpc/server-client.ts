import { appRouter } from "@/server"

export const dynamic = "force-dynamic"

export const serverClient = appRouter.createCaller({})
