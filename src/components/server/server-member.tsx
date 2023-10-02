"use client";

import { Member, Role, Profile, Server, VisitedName } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";
import { trpc } from "@/_trpc/client";

interface ServerMemberProps {
    member: Member & { profile: Profile; };
}

export const roleIconMap = {
    [Role.GUEST]: null,
    [Role.MOD]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    [Role.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
};

export const ServerMember = ({
    member,
}: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const HistoryMutation = trpc.profile.updateVisited.useMutation();

    const utils = trpc.useContext();

    const icon = roleIconMap[member.role];

    const onClick = () => {
        // sheetIsOpen.value = false;
        router.push(`/servers/${params?.serverId}/members/${member.id}`);

        HistoryMutation.mutate({
            serverId: params?.serverId as string,
            memberId: member.id,
            visitedName: VisitedName.Member
        }, {
            onSuccess(res) {

                utils.profile.getHistory.setData({}, (oldData) => {
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

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar
                imageUrl={member.profile.imageUrl}
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p
                className={cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
            {icon}
        </button>
    );
};