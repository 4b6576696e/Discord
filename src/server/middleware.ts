import { auth } from "@clerk/nextjs"
import { publicProcedure } from "./trpc"
import { TRPCError } from "@trpc/server"

export const authProcedure = publicProcedure.use(({ ctx, next }) => {
    console.log("[Middleware]")

    const userId = auth().userId ?? ""

    if (!userId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
        })
    }

    const newContext = { userId }

    return next({ ctx: newContext })
})
