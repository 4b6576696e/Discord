"use client";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import React, { memo, useEffect } from 'react';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FileUpload from "../file-upload";
import { trpc } from "@/_trpc/client";
import { useRouter } from "next/navigation";
import { useModalStore } from "../../store/modal-store";
import { useUser } from "@/store/user-details";
import { Server } from "@prisma/client";
import { ServerwithMembersWithProfile } from "../../../types";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required"
    })
});

function EditServer() {
    const { onClose, isOpen, type, data: {server, profileId} } = useModalStore();

    const isModalOpen = isOpen && type === "edit-server";

    const utils = trpc.useContext();

    const mutation = trpc.server.editServer.useMutation();

    const form = useForm({
        defaultValues: {
            name: "",
            imageUrl: ""
        },
        resolver: zodResolver(formSchema)
    });

    const isLoading = mutation.isLoading;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // new Image().src = values.imageUrl;

        mutation.mutate({
            serverId: server!.id,
            name: values.name,
            imageUrl: values.imageUrl
        }, {
            onSuccess(res) {
                // form.reset();
                utils.server.getAllServer.setData({ profileId }, (oldData: Server[]) => {
                    let newData = [...oldData];

                    let index = newData.findIndex((server: Server) => {
                        return server.id === server!.id;
                    });

                    newData[index].name = values.name;
                    newData[index].imageUrl = values.imageUrl;

                    return newData;
                });

                utils.server.getServer.setData({ serverId: server!.id }, (oldData: ServerwithMembersWithProfile) => {
                    return {
                        ...oldData,
                        name: values.name,
                        imageUrl: values.imageUrl
                    };
                });

                onClose();
            }
        });
    };

    useEffect(() => {
        if (server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);
        }
    }, [server, form]);


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold capitalize">
                        Edit your server
                    </DialogTitle>

                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default memo(EditServer);