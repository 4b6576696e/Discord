"use client";

import React from 'react';
import { ServerwithMembersWithProfile } from '../../../types';
import { Role } from '@prisma/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, UserPlus, Users, PlusCircle, Trash, LogOut } from 'lucide-react';
import { useModalStore } from '@/store/modal-store';


type Props = {
    server: ServerwithMembersWithProfile;
    role: Role;
    profileId: string;
};

function ServerHeader({ server, role, profileId }: Props) {
    const {
        onOpen
    } = useModalStore();

    const isModerator = role === Role.ADMIN || role === Role.MOD ? true : false;
    const isAdmin = role === Role.ADMIN ? true : false;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className='focus:outline-none'
            >
                <div
                    role='button'
                    className=" w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"                >
                    <p className='truncate'>{server.name}</p>
                    <ChevronDown className="h-5 w-5 ml-auto shrink-0" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {isModerator &&
                    <DropdownMenuItem
                        onClick={() => onOpen("invite-people", { server })}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                }
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("edit-server", { server, profileId })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("manage-member", { server })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Manage Member
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("create-channel")}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (<DropdownMenuSeparator />)}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("delete-server", {server, profileId})}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("leave-server", {server, profileId})}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

    );
}

export default ServerHeader;