"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/store/modal-store";
import { EmojiPicker } from "../emoji-picker";
import { useQueryClient } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import { Member } from "@prisma/client";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
    member: Member;
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type,
    member
}: ChatInputProps) => {
    const { onOpen } = useModalStore();
    const queryClient = useQueryClient();

    const queryKey = `chat:${query?.channelId}`;

    // const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        // const message = {
        //     channelId: query.channelId,

        //     content: values.content,

        //     createdAt: new Date().toISOString(),

        //     deleted: false,

        //     fileUrl: null,

        //     id: randomUUID(),

        //     member: member,

        //     memberId: member.id,

        //     updatedAt: new Date().toISOString()
        // };

        // queryClient.setQueryData([queryKey], (oldData: any) => {
        //     if (!oldData || !oldData.pages || oldData.pages.length === 0) {
        //         return {
        //             pages: [
        //                 {
        //                     items: [message],
        //                 },
        //             ],
        //         };
        //     }

        //     const newData = [...oldData.pages];

        //     newData[0] = {
        //         ...newData[0],
        //         items: [message, ...newData[0].items],
        //     };

        //     return {
        //         ...oldData,
        //         pages: newData,
        //     };
        // });

        form.reset();
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, values);



            //   router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        autoCorrect="false"
                                        type="button"
                                        onClick={() => onOpen("attachment-file", { apiUrl, query })}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        // disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                        placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                        {...field}
                                        autoComplete={"off"}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker
                                            onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};