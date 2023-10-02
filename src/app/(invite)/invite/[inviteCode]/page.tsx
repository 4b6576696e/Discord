import { isAuth } from '@/components/hooks/component-route-validation';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

type Props = {
    params: { inviteCode: string; };
};

export const dynamic = "force-dynamic";


async function InvitationHandler({
    params: { inviteCode }
}: Props) {
    const profile = await isAuth();

    const existingServer = await db.server.findUnique({
        where: {
            inviteCode,
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

    if (existingServer) return redirect(`/servers/${existingServer.id}/channels/${existingServer.channels[0].id}`);

    const server = await db.server.update({
        where: {
            inviteCode
        },
        data: {
            members: {
                create: [
                    { profileId: profile.id }
                ]
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

    if (server) return redirect(`/servers/${server.id}/channels/${server.channels[0].id}`);

    return (
        null
    );
}

export default InvitationHandler;