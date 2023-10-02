import React from 'react';
import { getQueryClient } from '../react-query/getQueryClient';
import { serverClient } from '@/_trpc/server-client';
import { dehydrate } from '@tanstack/react-query';
import { isAuth } from '../hooks/component-route-validation';
import ReactQueryHydrate from '../react-query/react-query-hydrate';
import NavigationSidebar from './navigation-sidebar';
import { History, Server, VisitedName } from '@prisma/client';
import { useNavServer } from '@/store/nav-server';
import { ServerWithChannels } from '../../../types';
// import { revalidatePath } from 'next/cache';

type Props = {};

async function NavigationSidebarPrefetch({ }: Props) {
    console.log("[navigation sidebar]");

    const profile = await isAuth();

    // const history: History[] = profile.history;

    // let servers: ServerWithChannels[] = [];

    const getServer = async () => {
        return await serverClient.server.getAllServer({ profileId: profile.id });

        // servers = S;

        // return S;
    };

    const getHistory = async () => {
        return await serverClient.profile.getHistory({});
    };

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery([["server", "getAllServer"], { "input": { "profileId": profile.id }, "type": "query" }], getServer);
    await queryClient.prefetchQuery([["profile", "getHistory"], { "input": {}, "type": "query" }], getHistory);

    const dehydratedState = dehydrate(queryClient);

    return (
        <ReactQueryHydrate state={dehydratedState}>
            <NavigationSidebar profileId={profile.id} />
        </ReactQueryHydrate>
    );
}

export default NavigationSidebarPrefetch;