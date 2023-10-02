import { z } from "zod"
import { authProcedure } from "../middleware"
import { router } from "../trpc"
import db from "@/lib/db"
import { randomUUID } from "crypto"
import { getProfile } from "@/lib/get-profile"
import { onServerError } from "@/lib/error"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
// import { revalidatePath } from "next/cache";?

export const serverRouter = router({
    createServer: authProcedure
        .input(
            z.object({
                name: z.string(),
                imageUrl: z.string(),
            })
        )
        .mutation(({ input, ctx }) => {
            console.log("[Create-Server-trpc]")

            return onServerError(async () => {
                const { name, imageUrl } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                const server = await db.server.create({
                    data: {
                        name,
                        imageUrl,
                        profileId: profile.id,
                        inviteCode: randomUUID(),
                        channels: {
                            create: [
                                { name: "general", profileId: profile.id },
                            ],
                        },
                        members: {
                            create: [
                                { profileId: profile.id, role: Role.ADMIN },
                            ],
                        },
                    },
                    include: {
                        channels: true,
                    },
                })

                // revalidatePath(`/server/${server.id}`)

                return server
            })
        }),
    generateNewInviteUrl: authProcedure
        .input(
            z.object({
                serverId: z.string(),
            })
        )
        .mutation(({ input, ctx }) => {
            console.log("[generateNewInviteUrl-trpc]")

            return onServerError(async () => {
                const { serverId } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                let server

                try {
                    server = await db.server.update({
                        where: {
                            id: serverId,
                            profileId: profile.id,
                        },
                        data: {
                            inviteCode: randomUUID(),
                        },
                    })
                } catch (error) {
                    if (
                        error instanceof PrismaClientKnownRequestError &&
                        error.code === "P2025"
                    )
                        server = await db.server.findUnique({
                            where: {
                                id: serverId,
                            },
                        })
                    else throw new Error((error as Error).message)
                }

                return server?.inviteCode
            })
        }),
    editServer: authProcedure
        .input(
            z.object({
                serverId: z.string(),
                imageUrl: z.string(),
                name: z.string(),
            })
        )
        .mutation(({ input, ctx }) => {
            console.log("[editServer-trpc]")

            return onServerError(async () => {
                const { serverId, name, imageUrl } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                const server = await db.server.update({
                    where: {
                        id: serverId,
                        profileId: profile.id,
                    },
                    data: {
                        name,
                        imageUrl,
                    },
                })

                return true
            })
        }),
    getServer: authProcedure
        .input(
            z.object({
                serverId: z.string(),
            })
        )
        .query(({ input, ctx }) => {
            return onServerError(async () => {
                const { serverId } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                const server = await db.server.findUnique({
                    where: {
                        id: serverId,
                        members: {
                            some: {
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

                return server
            })
        }),
    getAllServer: authProcedure
        .input(z.object({}).nullish())
        .query(({ input, ctx }) => {
            console.log("[getAllServer-trpc]")

            return onServerError(async () => {
                const { userId } = ctx

                const profile = await getProfile(userId)

                const servers = await db.server.findMany({
                    where: {
                        members: {
                            some: {
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

                return servers
            })
        }),
    deleteServer: authProcedure
        .input(
            z.object({
                serverId: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            console.log("[deleteServer-trpc]")

            // onServerError(async () => {
            const { serverId } = input
            const { userId } = ctx

            const profile = await getProfile(userId)

            await db.server.delete({
                where: {
                    id: serverId,
                    profileId: profile.id,
                },
            })

            await db.history.deleteMany({
                where: {
                    profileId: profile.id,
                    serverId,
                },
            })

            return {
                success: true,
            }
            // })
        }),
    leaveServer: authProcedure
        .input(
            z.object({
                serverId: z.string(),
            })
        )
        .mutation(({ input, ctx }) => {
            console.log("[leaveServer-trpc")

            return onServerError(async () => {
                const { serverId } = input
                const { userId } = ctx

                const profile = await getProfile(userId)

                const server = await db.server.update({
                    where: {
                        id: serverId,
                        profileId: {
                            not: profile.id,
                        },
                        members: {
                            some: {
                                profileId: profile.id,
                            },
                        },
                    },
                    data: {
                        members: {
                            deleteMany: {
                                profileId: profile.id,
                            },
                        },
                    },
                })
            })
        }),
})
