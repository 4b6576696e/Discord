"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal-store";
import { trpc } from "@/_trpc/client";
import { ServerWithChannels } from "../../../types";

export default function DeleteChannel() {
    const { isOpen, onClose, type, data } = useModalStore();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === "delete-channel";
    const { channel, redirectTo } = data;

    const mutation = trpc.channel.deleteChannel.useMutation();
    const historyMutation = trpc.profile.deleteHistory.useMutation();
    const utils = trpc.useContext();

    const isLoading = mutation.isLoading || historyMutation.isLoading;

    const isError = mutation.isError;


    const onClick = async () => {
        historyMutation.mutate({
            serverId: params?.serverId as string,
            channelId: channel!.id,
        }, {
            onSuccess() {
                mutation.mutate({
                    serverId: params?.serverId as string,
                    channelId: channel!.id
                }, {
                    onSuccess() {

                        utils.server.getServer.setData({ serverId: params?.serverId as string }, (oldData: ServerWithChannels) => {
                            const newData = oldData.channels.filter((ch) => ch.id !== channel!.id);

                            return {
                                ...oldData,
                                channels: newData
                            };
                        });
                        onClose();
                        router.push(`/servers/${params?.serverId}/channels/${redirectTo}`);
                    },
                });
            }
        });
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="text-indigo-500 font-semibold">#{channel?.name}</span> will be permanently deleted.
                        {isError && <p className="text-rose-500">Something went Wrong</p>}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}