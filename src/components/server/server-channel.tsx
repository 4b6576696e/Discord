"use client";

import { Channel, ChannelType, History, Role, VisitedName } from '@prisma/client';
import React from 'react';
import { ServerwithMembersWithProfile } from '../../../types';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@radix-ui/react-select';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import ActionTooltip from '../action-tooltip';
import { ModalType, useModalStore } from '@/store/modal-store';
import { useRouter } from 'next/navigation';
import { trpc } from '@/_trpc/client';

type Props = {
    channel: Channel;
    role: Role;
    generalId: string;
    server: ServerwithMembersWithProfile;
};

export const iconMap = {
    [ChannelType.TEXT]: <Hash className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />,
    [ChannelType.AUDIO]: <Mic className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />,
    [ChannelType.VIDEO]: <Video className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />,
};

function ServerChannel({
    channel,
    role,
    generalId,
    server
}: Props) {
    const params = useParams();
    const router = useRouter();
    const utils = trpc.useContext();

    const HistoryMutation = trpc.profile.updateVisited.useMutation();

    const { onOpen } = useModalStore();

    const Icon = iconMap[channel.type];

    const isModerator = role === Role.ADMIN || role === Role.MOD;

    const clickHandler = () => {
        // sheetIsOpen.value = false;
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`);

        HistoryMutation.mutate({
            serverId: params?.serverId as string,
            channelId: channel.id,
            visitedName: VisitedName.Channel
        }, {
            onSuccess(res) {
                console.log(res);

                utils.profile.getHistory.setData({}, (oldData) => {
                    console.log(oldData);

                    const newData = [...oldData!];

                    const index = newData.findIndex(history => {
                        if (history.serverId === params?.serverId) return true;
                    });

                    if (index === -1)
                        newData.push(res);
                    else
                        newData[index] = res;

                    console.log(newData);

                    return newData;
                });
            }
        });
    };

    const onAction = (e: React.MouseEvent, type: ModalType) => {
        e.preventDefault();
        onOpen(type, { channel, redirectTo: generalId, server });
    };

    return (
        <button
            onClick={clickHandler}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            {Icon}
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {channel.name}
            </p>
            {channel.name !== "general" && isModerator && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit
                            onClick={(e) => onAction(e, "edit-channel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={(e) => onAction(e, "delete-channel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock
                    className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400"
                />
            )}
        </button>
    );
}

export default ServerChannel;