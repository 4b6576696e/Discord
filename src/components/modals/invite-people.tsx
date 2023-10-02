"use client";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import React, { memo, useRef, useState } from 'react';
import useIsMounted from "../hooks/useIsMounted";

// import * as z from "zod";
import { Label } from "@radix-ui/react-label";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useModalStore } from "../../store/modal-store";
import { useOrigin } from "../hooks/use-origin";
import { trpc } from "@/_trpc/client";
import { ServerwithMembersWithProfile } from "../../../types";
import { useUser } from "@/store/user-details";


function InvitePeople() {
    const { onClose, isOpen, type, data: { server }, onOpen } = useModalStore();

    const utils = trpc.useContext();

    const origin = useOrigin();

    const [copied, setCopied] = useState(false);

    const { isLoading, mutate } = trpc.server.generateNewInviteUrl.useMutation();

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const timeout: any = useRef(null);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);


        timeout.current = setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = () => {
        mutate({
            serverId: server!.id
        }, {
            onSuccess(res) {
                utils.server.getServer.setData({ serverId: server!.id }, (oldData: ServerwithMembersWithProfile) => {
                    const newServer = { ...oldData, inviteCode: res };

                    // setServer(newServer);

                    return newServer;
                });
                onOpen("invite-people", { server: utils.server.getServer.getData({ serverId: server!.id }) });
            },
            onError(e) {
                console.error(e);
            }
        });
    };

    return (
        <Dialog open={isOpen && type === 'invite-people'}
            onOpenChange={onClose}
        >
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold capitalize">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label
                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                            readOnly
                        />
                        <Button
                            disabled={isLoading} onClick={onCopy} size="icon">
                            {copied
                                ? <Check className="w-4 h-4" />
                                : <Copy className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default memo(InvitePeople);