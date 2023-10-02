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


function LeaveServer() {
    const { onClose, isOpen, type, data: { server, profileId } } = useModalStore();

    const utils = trpc.useContext();
    const router = useRouter();

    const { isLoading, mutate } = trpc.server.leaveServer.useMutation();

    const onClick = () => {
        let nextRouteId: string;

        mutate({
            serverId: server!.id
        }, {
            onSuccess(res) {
                let prev = 0;
                utils.server.getAllServer.setData({ profileId }, (oldData: Server[]) => {
                    const newData = oldData.filter((data, index) => {
                        if (data.id === server!.id) {
                            prev = --index;
                            return false;
                        }

                        return true;
                    });

                    if (newData.length === 0) return router.replace("/");

                    if (prev < 0) {
                        nextRouteId = oldData[0].id;
                    } else {
                        nextRouteId = oldData[prev].id;
                    }
                    router.replace(`/server/${nextRouteId}`);

                    return [...newData];
                });
                onClose();
            }
        });
    };


    return (
        <Dialog open={isOpen && type === "leave-server"} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4" autoFocus={false}>
                    <div className="flex items-center justify-between w-full" autoFocus={false}>
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus={false}
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

export default memo(LeaveServer);