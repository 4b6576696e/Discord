"use client";

import React, { useEffect } from 'react';
import NavigationAction from './navigation-action';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavigationItem from './navigation-item';
import { ModeToggle } from '../ui-theme-toggle';
import { UserButton } from '@clerk/nextjs';
import { trpc } from '@/_trpc/client';
import { History, Server, VisitedName } from '@prisma/client';
import { useUser } from '@/store/user-details';
import { ServerWithChannels } from '../../../types';

interface Props {
    profileId: string;
    // history: History[];
}

function NavigationSidebar({ profileId }: Props) {

    const { data: servers } = trpc.server.getAllServer.useQuery({ profileId }, {
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000
    });

    const { data } = trpc.profile.getHistory.useQuery({}, {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000
    });

    const history: any[] = data ?? [];

    const serverWithHistory: ({ server: Server, history: History; })[] = servers.map((server: ServerWithChannels) => {
        const index = history.findIndex((visited: History) => {
            if (visited.serverId === server.id) return true;
        });

        const past = history[index] ?? {};

        if (!past || !past.visitedName) {
            past.visitedName = VisitedName.Channel;

            const channelIndex = server.channels.findIndex((channel) => {
                if (channel.name === "general") return true;
            });

            past.channelId = server.channels[channelIndex].id;
        }

        return {
            server,
            history: past
        };
    });


    return (
        <div
            autoFocus={false}
            className='flex flex-col space-y-4  items-center w-full h-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3 text-primary'
        >
            <NavigationAction
                profileId={profileId}
            />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ScrollArea
                className='flex-1 w-full scroll-'
            >
                {serverWithHistory.map(({ server, history }) => <div key={server.id} className="mb-4">
                    <NavigationItem
                        imageUrl={server.imageUrl}
                        name={server.name}
                        id={server.id}
                        channelId={history.channelId}
                        memberId={history.memberId}
                        subRoute={history.visitedName}
                    />
                </div>)}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default React.memo(NavigationSidebar);