import { TRPCError } from "@trpc/server"

export const onServerError = (fn: any) => {
    try {
        return fn()
    } catch (error) {
        console.log(error)
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
        })
    }
}
