import { TRPCError } from "@trpc/server"
import db from "./db"

export const getProfile = async (
    id: string,
    { history }: { history: Boolean } = { history: false }
) => {
    let profile

    if (history) {
        profile = await db.profile.findUnique({
            where: {
                userId: id,
            },
            include: {
                history: {
                    orderBy: {
                        updatedAt: "asc",
                    },
                },
            },
        })
    } else {
        profile = await db.profile.findUnique({
            where: {
                userId: id,
            },
        })
    }

    if (!profile) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
        })
    }

    return profile
}
