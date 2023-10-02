"use client";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "../ui/dialog";


import React, { memo, useEffect, useState } from 'react';

import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useModalStore } from "../../store/modal-store";
import { trpc } from "@/_trpc/client";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import { roleIconMap } from "@/lib/icon-map";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Member, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ServerwithMembersWithProfile } from "../../../types";

function ManageMembers() {
    const utils = trpc.useContext();

    const { onClose, isOpen, type, data: { server }, onOpen } = useModalStore();

    const [loadingId, setLoadingId] = useState("");

    const router = useRouter();

    const RoleMutation = trpc.member.updateRole.useMutation();
    const kickMutation = trpc.member.removeMember.useMutation();
    const historyMutation = trpc.profile.deleteHistory.useMutation();

    const onRoleChange = (memberId: string, role: Role) => {
        setLoadingId(memberId);
        RoleMutation.mutate({
            serverId: server!.id,
            memberId: memberId,
            role
        }, {
            onSuccess(members: Member[]) {
                utils.server.getServer.setData({ serverId: server!.id }, (oldData: ServerwithMembersWithProfile) => {
                    return { ...oldData, members };
                });
                onOpen("manage-member", { server: utils.server.getServer.getData({ serverId: server!.id }) });
            },
            onSettled() {
                setLoadingId("");
            }
        });
    };

    const onKick = (memberId: string) => {
        setLoadingId(memberId);
        historyMutation.mutate({
            memberId: memberId,
            serverId: server!.id
        }, {
            onSuccess() {
                kickMutation.mutate({
                    memberId,
                    serverId: server!.id
                }, {
                    onSuccess(members: Member[]) {
                        // onOpen("manage-member", { server: res });
                        // router.refresh();
                        utils.server.getServer.setData({ serverId: server!.id }, (oldData: ServerwithMembersWithProfile) => {
                            return { ...oldData, members };
                        });
                        if (members.length !== 0)
                            router.replace(`/servers/${server!.id}/members/${members[0].id}`);
                        else
                            router.refresh();
                    },
                });
            },
            onSettled() {
                setLoadingId("");
            }
        });


    };

    return (
        <Dialog open={isOpen && type === 'manage-member'}
            onOpenChange={onClose}
        >
            <DialogContent className="bg-white text-black p-0 overflow-hidden focus:outline-none">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold capitalize">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} member
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] px-6 pb-8">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar imageUrl={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name === "null" ? member.profile.email.split("@")[0] : member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            <div className="ml-auto">
                                {server?.profileId !== member.profileId && loadingId !== member.id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger autoFocus={false} className="focus-within:outline-none">
                                            <MoreVertical className="h-4 w-4 text-zinc-500 focus:outline-none focus:border-none outline-none border-none" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger
                                                    className="flex items-center"
                                                >
                                                    <ShieldQuestion
                                                        className="w-4 h-4 mr-2"
                                                    />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "GUEST")}
                                                        >
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Guest
                                                            {member.role === "GUEST" && (
                                                                <Check
                                                                    className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "MOD")}
                                                        >
                                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                                            Moderator
                                                            {member.role === "MOD" && (
                                                                <Check
                                                                    className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuItem
                                                onClick={() => onKick(member.id)}
                                            >
                                                <Gavel className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                {loadingId === member.id && (
                                    <Loader2
                                        className="animate-spin text-zinc-500  w-4 h-4"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </ScrollArea>

            </DialogContent>
        </Dialog>
    );
}

export default memo(ManageMembers);