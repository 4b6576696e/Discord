import { ChannelType, Role } from '@prisma/client';
import React from 'react';
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModalStore } from '@/store/modal-store';

type Props = {
    type?: ChannelType;
    role: Role;
    title: string;
    sectionType: "channels" | "members";
};

function ServerSection({
    role,
    sectionType,
    title,
    type,
}: Props) {
    const { onOpen } = useModalStore();

    const isModerator = role === Role.ADMIN || role === Role.MOD;

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {title}
            </p>
            {(isModerator && sectionType === "channels") && (
                <ActionTooltip
                    label='create channel'
                    align='center'
                    side='top'
                >
                    <button
                        onClick={() => onOpen("create-channel")}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
            {isModerator && sectionType === "members" && (
                <ActionTooltip
                    label='Manage Members'
                    align='center'
                    side='top'
                >
                    <button
                        onClick={() => onOpen("manage-member")}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
}

export default ServerSection;