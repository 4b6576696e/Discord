import initialProfile from "@/lib/initial-profile";
import db from "@/lib/db";
import { redirect } from "next/navigation";

import InitialModal from "@/components/modals/iniitial-modal";
import { History, Profile, VisitedName } from "@prisma/client";

export const dynamic = "force-dynamic";


export default async function Home() {
    const profile: Profile & { history: History[]; } = await initialProfile();

    // console.log(profile.history.length);

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    if (server) {
        let url = '/servers/';

        let channelId = "/channels/";
        let memberId = "/members/";

        if (profile.history.length === 0) {
            url += server.id;
            channelId += server.channels[0].id;
            url += channelId;
        } else {
            url += profile.history[0].serverId;

            const lastVisited = profile.history[0].visitedName;

            if (lastVisited === VisitedName.Channel) {
                channelId += profile.history[0].channelId;
                url += channelId;
            } else if (lastVisited === VisitedName.Member) {
                memberId += profile.history[0].memberId;
                url += memberId;
            }
        }

        return redirect(url);
    }

    return (<>
        <InitialModal />
    </>
    );
}
