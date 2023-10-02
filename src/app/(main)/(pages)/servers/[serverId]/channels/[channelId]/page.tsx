import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import db from "@/lib/db";
import { isAuth } from "@/components/hooks/component-route-validation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { getQueryClient } from "@/components/react-query/getQueryClient";
import { ChatMessages } from "@/components/chat/chat-messages";
import { dehydrate } from "@tanstack/react-query";
import ReactQueryHydrate from "@/components/react-query/react-query-hydrate";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    };
}

export const dynamic = "force-dynamic";

const ChannelIdPage = async ({
    params
}: ChannelIdPageProps) => {
    const profile = await isAuth();

    if (!profile) {
        return redirectToSignIn();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    });

    if (!channel || !member) {
        redirect("/");
    }

    return (

        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                profileId={profile.id}
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {
                (channel.type === ChannelType.TEXT) && (
                    <>
                        <ChatMessages
                            member={member}
                            name={channel.name}
                            chatId={channel.id}
                            type="channel"
                            apiUrl="/api/messages"
                            socketUrl="/api/socket/messages"
                            socketQuery={{
                                channelId: channel.id,
                                serverId: channel.serverId,
                            }}
                            paramKey="channelId"
                            paramValue={channel.id}
                        />
                        <ChatInput
                            name={channel.name}
                            type="channel"
                            apiUrl="/api/socket/messages"
                            query={{
                                channelId: channel.id,
                                serverId: channel.serverId,
                            }}
                            member={member}
                        />
                    </>
                )
            }

            {channel.type === ChannelType.AUDIO && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={true}
                />
            )}
        </div>
    );
};

export default ChannelIdPage;

// function currentProfile() {
//     throw new Error("Function not implemented.");
// }
