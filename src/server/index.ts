import { z } from "zod"

import { router } from "./trpc"
import { serverRouter } from "./routers/server.route"
import { memberRouter } from "./routers/member.route"
import { channelRouter } from "./routers/channel.route"
import { profileRouter } from "./routers/profile.route"

export const appRouter = router({
    server: serverRouter,
    member: memberRouter,
    channel: channelRouter,
    profile: profileRouter,
})

export type AppRouter = typeof appRouter
