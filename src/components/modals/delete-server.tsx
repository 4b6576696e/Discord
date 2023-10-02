"use client";

import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "../ui/dialog";
import { Button } from "../ui/button";

import React, { memo } from 'react';
// import * as z from "zod";

import { useModalStore } from "../../store/modal-store";
import { trpc } from "@/_trpc/client";
import { useUser } from "@/store/user-details";
import { Server } from "@prisma/client";
import { deleteImage } from "@/serveractions/delete-image";
import { useRouter } from "next/navigation";
import { ServerWithChannels } from "../../../types";


function DeleteServer() {
    const { onClose, isOpen, type, data: { profileId, server } } = useModalStore();

    const utils = trpc.useContext();
    const router = useRouter();

    const { isLoading, mutate } = trpc.server.deleteServer.useMutation();
    const historyMutation = trpc.profile.deleteHistory.useMutation();

    const onClick = () => {
        const imageUrl = server!.imageUrl;

        const key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        let nextRouteId: string, generalId: string;

        mutate({
            serverId: server!.id
        }, {
            onSuccess(res) {
                let prev = 0;
                utils.server.getAllServer.setData({ profileId }, (oldData: ServerWithChannels[]) => {
                    const newData = oldData.filter((data, index) => {
                        if (data.id === server!.id) {
                            prev = --index;
                            return false;
                        }

                        return true;
                    });

                    if (newData.length === 0) return router.replace("/");

                    if (prev < 0) {
                        nextRouteId = newData[0].id;
                        generalId = newData[0].channels[0].id;
                    } else {
                        nextRouteId = oldData[prev].id;
                        generalId = oldData[prev].channels[0].id;

                    }
                    router.replace(`/servers/${nextRouteId}/channels/${generalId}`);

                    return [...newData];
                });
                deleteImage(key);
                onClose();
            }
        });
    };


    return (
        <Dialog open={isOpen && type === "delete-server"} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="text-indigo-500 font-semibold">{server?.name}</span> will be permanently deleted.
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

export default memo(DeleteServer);