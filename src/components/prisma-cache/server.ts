import db from "@/lib/db"
import { Server } from "@prisma/client"

export const getAllServers = async (profileId: string): Promise<Server[]> => {
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profileId,
                },
            },
        },
    })

    return servers
}
