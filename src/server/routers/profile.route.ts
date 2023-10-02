import { z } from "zod"
import { authProcedure } from "../middleware"
import { router } from "../trpc"
import { getProfile } from "@/lib/get-profile"
import db from "@/lib/db"
import { History, Profile, VisitedName } from "@prisma/client"
import { ProfileWithHistory } from "../../../types"
import delay from "@/lib/delay"

export const profileRouter = router({
    updateVisited: authProcedure
        .input(
            z.object({
                serverId: z.string(),
                channelId: z.string().nullish(),
                memberId: z.string().nullish(),
                visitedName: z.nativeEnum(VisitedName),
            })
        )
        .mutation(async ({ input, ctx }) => {
            console.log("[updateVisited-trpc]")

            const { serverId, channelId, memberId, visitedName } = input
            const { userId } = ctx

            // await delay(5)

            const profile = await getProfile(userId)

            // const history = await db.history.upsert({
            //     where: {
            //         serverId,
            //         profileId: P.id,
            //     },
            //     update: {
            //         channelId: channelId ?? "",
            //         memberId: memberId ?? "",
            //         visitedName,
            //     },
            //     create: {
            //         channelId: channelId ?? "",
            //         memberId: memberId ?? "",
            //         serverId,
            //         visitedName,
            //         profileId: P.id,
            //     },
            // })

            let history = await db.history.findFirst({
                where: {
                    serverId,
                    profileId: profile.id,
                },
            })

            if (history) {
                history = await db.history.update({
                    where: {
                        id: history.id,
                    },
                    data: {
                        channelId: channelId ?? "",
                        memberId: memberId ?? "",
                        visitedName,
                    },
                })
            } else {
                history = await db.history.create({
                    data: {
                        channelId: channelId ?? "",
                        memberId: memberId ?? "",
                        visitedName,
                        serverId,
                        profileId: profile.id,
                    },
                })
            }

            return history
        }),
    getHistory: authProcedure
        .input(z.object({}).nullish())
        .query(async ({ input, ctx }) => {
            const { userId } = ctx

            const profile = (await getProfile(userId, {
                history: true,
            })) as ProfileWithHistory

            return profile.history
        }),
    deleteHistory: authProcedure
        .input(
            z.object({
                channelId: z.string().nullish(),
                memberId: z.string().nullish(),
                serverId: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const profile = await getProfile(ctx.userId)

            const { channelId, memberId, serverId } = input

            await db.history.deleteMany({
                where: {
                    profileId: profile.id,
                    serverId: serverId,
                    channelId: channelId ?? "",
                    memberId: memberId ?? "",
                },
            })

            return true
        }),
})
