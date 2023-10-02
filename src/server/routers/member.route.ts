import { z } from "zod"
import { authProcedure } from "../middleware"
import { router } from "../trpc"
import { onServerError } from "@/lib/error"
import { getProfile } from "@/lib/get-profile"
import db from "@/lib/db"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
// import { revalidatePath } from "next/cache"

// const

export const memberRouter = router({
    updateRole: authProcedure
        .input(
            z.object({
                serverId: z.string(),
                memberId: z.string(),
                role: z.nativeEnum(Role),
            })
        )
        .mutation(({ input, ctx }) => {
            console.log("[updateRole-trpc]")

            return onServerError(async () => {
                const { serverId, memberId, role } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                const server = await db.server.update({
                    where: {
                        id: serverId,
                        profileId: profile.id,
                    },
                    data: {
                        members: {
                            update: {
                                where: {
                                    id: memberId,
                                    profileId: {
                                        not: profile.id,
                                    },
                                },
                                data: {
                                    role: role,
                                },
                            },
                        },
                    },
                    include: {
                        members: {
                            include: {
                                profile: true,
                            },
                            orderBy: {
                                role: "asc",
                            },
                        },
                    },
                })

                return server.members
            })
        }),
    removeMember: authProcedure
        .input(
            z.object({
                serverId: z.string(),
                memberId: z.string(),
            })
        )
        .mutation(({ input, ctx }) => {
            console.log("[removeMember-trpc")

            return onServerError(async () => {
                const { serverId, memberId } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                const server = await db.server.update({
                    where: {
                        id: serverId,
                        profileId: profile.id,
                    },
                    data: {
                        members: {
                            deleteMany: {
                                id: memberId,
                                profileId: {
                                    not: profile.id,
                                },
                            },
                        },
                    },
                    include: {
                        channels: true,
                        members: {
                            include: { profile: true },
                            orderBy: {
                                role: "asc",
                            },
                        },
                    },
                })

                return server.members
            })
        }),
})
