import React, { Suspense } from 'react';
import ReactQueryHydrate from '../react-query/react-query-hydrate';
import ServerSidebar from './server-sidebar';
import { serverClient } from '@/_trpc/server-client';
import delay from '@/lib/delay';
import { dehydrate } from '@tanstack/react-query';
import { isAuth } from '../hooks/component-route-validation';
import { getQueryClient } from '../react-query/getQueryClient';
import { Server } from '@prisma/client';

type Props = {
    serverId: string;
};


async function ServerSidebarPrefetch({ serverId }: Props) {
    const profile = await isAuth();

    const getServer = async () => {
        return await serverClient.server.getServer({ serverId });
    };

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery([["server", "getServer"], { "input": { "serverId": serverId }, "type": "query" }], getServer);
    // await queryClient.pre

    const dehydratedState = dehydrate(queryClient);

    return (
        <ReactQueryHydrate state={dehydratedState}>
            <ServerSidebar serverId={serverId} profileId={profile.id} />
        </ReactQueryHydrate>
    );
}

export default ServerSidebarPrefetch;