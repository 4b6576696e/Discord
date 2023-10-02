"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import { trpc } from "@/_trpc/client";
import { History, VisitedName } from "@prisma/client";



interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member",
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined;
    }[];
}

export default function ServerSearch({
    data
}: ServerSearchProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    const utils = trpc.useContext();

    const HistoryMutation = trpc.profile.updateVisited.useMutation();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const onSearch = ({ id, type }: { id: string, type: "channel" | "member"; }) => {
        setOpen(false);

        if (type === "member") {
            HistoryMutation.mutate({
                serverId: params?.serverId as string,
                memberId: id,
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

            return router.push(`/servers/${params?.serverId}/members/${id}`);
        }

        if (type === "channel") {
            HistoryMutation.mutate({
                serverId: params?.serverId as string,
                channelId: id,
                visitedName: VisitedName.Channel
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

            return router.push(`/servers/${params?.serverId}/channels/${id}`);

        }
    };

    const onClickHandler = () => {
        setOpen(true);
    };

    return (
        <>
            <button
                onClick={onClickHandler}
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p
                    className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
                >
                    Search
                </p>
                <kbd
                    className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
                >
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>
                        No Results found
                    </CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;

                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, icon, name }) => {
                                    return (
                                        <CommandItem key={id} onSelect={() => onSearch({ id, type })}>
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
};