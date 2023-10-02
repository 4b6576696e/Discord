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
import { Channel, ChannelType, Server } from "@prisma/client";
import { ServerwithMembersWithProfile } from "../../../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required"
    }).refine((name) => name.toLowerCase() !== 'general',
        {
            message: "Channel name cannot be 'general'"
        }),
    type: z.nativeEnum(ChannelType)
});

function EditChannel() {
    const { onClose, isOpen, type, data: { channel, server } } = useModalStore();
    const router = useRouter();

    const isModalOpen = isOpen && type === "edit-channel";

    const utils = trpc.useContext();

    const mutation = trpc.channel.editChannel.useMutation();

    const form = useForm({
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT
        },
        resolver: zodResolver(formSchema)
    });

    const isLoading = mutation.isLoading;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // new Image().src = values.type;

        mutation.mutate({
            serverId: server!.id,
            name: values.name,
            type: values.type,
            channelId: channel!.id
        }, {
            onSuccess(res) {
                utils.server.getServer.setData({ serverId: server!.id }, (oldData: ServerwithMembersWithProfile) => {
                    // console.log({ ...oldData, res });
                    return { ...oldData, channels: res };
                });
                onClose();
                router.refresh();
            }
        });
    };

    useEffect(() => {
        if (channel) {
            form.setValue("name", channel!.name);
            form.setValue("type", channel!.type);
        }
    }, [channel, form]);


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold capitalize">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter Channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                >
                                                    <SelectValue placeholder="select a channel type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white outline-none border-0">
                                                {Object.values(ChannelType).map(channel => (
                                                    <div
                                                        key={channel}
                                                    >
                                                        <SelectItem
                                                            value={channel}
                                                            className="capitalize bg-zinc-300/50 text-black focus:text-black focus:bg-zinc-300/80 focus:outline-none"
                                                        >
                                                            {channel.toLowerCase()}
                                                        </SelectItem>
                                                        <Separator className="bg-white" />
                                                    </div>
                                                ))}
                                            </SelectContent>
                                        </Select>
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

export default memo(EditChannel);