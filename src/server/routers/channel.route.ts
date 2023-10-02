import { z } from "zod"
import { authProcedure } from "../middleware"
import { router } from "../trpc"
import { onServerError } from "@/lib/error"
import { getProfile } from "@/lib/get-profile"
import db from "@/lib/db"
import { ChannelType, Role } from "@prisma/client"

export const channelRouter = router({
    createChannel: authProcedure
        .input(
            z.object({
                serverId: z.string(),
                name: z.string(),
                type: z.nativeEnum(ChannelType),
            })
        )
        .mutation(({ input, ctx }) => {
            console.log("[createChannel-trpc]")

            return onServerError(async () => {
                const { serverId, name, type } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                const server = await db.server.update({
                    where: {
                        id: serverId,
                        members: {
                            some: {
                                profileId: profile.id,
                                role: {
                                    in: [Role.ADMIN, Role.MOD],
                                },
                            },
                        },
                    },
                    data: {
                        channels: {
                            create: {
                                name: name,
                                type: type,
                                profileId: profile.id,
                            },
                        },
                    },
                    include: {
                        channels: {
                            orderBy: {
                                createdAt: "asc",
                            },
                        },
                    },
                })

                return server.channels
            })
        }),
    editChannel: authProcedure
        .input(
            z.object({
                serverId: z.string(),
                channelId: z.string(),
                name: z.string(),
                type: z.nativeEnum(ChannelType),
            })
        )
        .mutation(async ({ input, ctx }) => {
            console.log("[editChannel-trpc]")

            // return onServerError(async () => {
            const { serverId, channelId, name, type } = input
            const { userId } = ctx

            const profile = await getProfile(userId)

            const server = await db.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            profileId: profile.id,
                            role: {
                                in: [Role.ADMIN, Role.MOD],
                            },
                        },
                    },
                },
                data: {
                    channels: {
                        update: {
                            where: {
                                id: channelId,
                                name: {
                                    not: "general",
                                },
                            },
                            data: {
                                name,
                                type,
                            },
                        },
                    },
                },
                include: {
                    channels: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            })

            return server.channels
            // });
        }),
    deleteChannel: authProcedure
        .input(
            z.object({
                channelId: z.string(),
                serverId: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const profile = await getProfile(ctx.userId)

            const { serverId, channelId } = input

            const server = await db.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            profileId: profile.id,
                            role: {
                                in: [Role.ADMIN, Role.MOD],
                            },
                        },
                    },
                },
                data: {
                    channels: {
                        delete: {
                            id: channelId,
                            name: {
                                not: "general",
                            },
                        },
                    },
                },
            })
        }),
})
