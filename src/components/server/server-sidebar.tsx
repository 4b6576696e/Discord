"use client";

import React, { memo, useEffect } from 'react';
import ServerHeader from './server-header';

import { Channel, ChannelType, Member, Profile, Role } from '@prisma/client';
import { trpc } from '@/_trpc/client';
import { useUser } from '@/store/user-details';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './server-search';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel, { iconMap } from './server-channel';
import { ServerMember, roleIconMap } from './server-member';
import { MemberWithProfile } from '../../../types';

type Props = {
    serverId: string;
    profileId: string;
};

function ServerSidebar({ serverId, profileId }: Props) {
    // const setServer = useUser(state => state.setServer);
    // const user = useUser();
    const router = useRouter();

    const { data: server, isLoading } = trpc.server.getServer.useQuery({ serverId }, {
        staleTime: 5 * 60 * 1000
    });

    // const {data} = trpc.profile.getHistory.useQuery({})

    // console.log(server);

    // useEffect(() => {
    //     user.setServer(server);
    // }, [server]);


    if (!server) {
        router.replace("/");
        return <></>;
    };


    const textChannels = server.channels.filter((channel: Channel) => (channel.type === ChannelType.TEXT));
    const audioChannels = server.channels.filter((channel: Channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server.channels.filter((channel: Channel) => channel.type === ChannelType.VIDEO);

    const members = server.members.filter((member: Member) => member.profileId !== profileId);

    const role = server.members.find((member: Member) => member.profileId === profileId)?.role;


    return (
        <div
            className='flex flex-col w-full h-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]'
        >
            <ServerHeader
                server={server}
                role={role!}
                profileId={profileId}
            />
            <ScrollArea
                className='flex-1 px-3'
            >
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel: Channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel: Channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel: Channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member: MemberWithProfile) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                }))
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels.length && (
                    <div className="mb-2">
                        <ServerSection
                            role={role}
                            sectionType='channels'
                            title='Text Channels'
                            type='TEXT'
                        />
                        {textChannels.map((channel: Channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                generalId={textChannels[0].id}
                                server={server}
                            />
                        )
                        )}
                    </div>
                )}
                {!!audioChannels.length && (
                    <div className="mb-2">
                        <ServerSection
                            role={role}
                            sectionType='channels'
                            title='Audio Channels'
                            type='AUDIO'
                        />
                        {audioChannels.map((channel: Channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                generalId={textChannels[0].id}
                                server={server}
                            />
                        )
                        )}
                    </div>
                )}
                {!!videoChannels.length && (
                    <div className="mb-2">
                        <ServerSection
                            role={role}
                            sectionType='channels'
                            title='Video Channels'
                            type='VIDEO'
                        />
                        {videoChannels.map((channel: Channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                generalId={textChannels[0].id}
                                server={server}

                            />
                        )
                        )}
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            title="Members"
                        //   type=''
                        />
                        <div className="space-y-[2px]">
                            {members.map((member: Member & { profile: Profile; }) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

export default memo(ServerSidebar);