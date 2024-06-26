import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import UserAvatar from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import ChatVideoButton from "./chat-video-button";

// import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
    profileId: string;
}

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl,
    profileId
}: ChatHeaderProps) => {
    return (
        <div className="shrink-0 text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId} profileId={profileId} />
            {type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "conversation" && (
                <UserAvatar
                    imageUrl={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    );
};