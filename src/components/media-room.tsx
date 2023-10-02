"use client";

import { useEffect, useRef, useState } from "react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader, Mic, Mic2, RefreshCw, Video } from "lucide-react";
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { useRouter } from "next/router";
import { Button } from "./ui/button";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

interface goLiveProps {
    chatId: string;
    name: React.MutableRefObject<string> | undefined;
    setToken: React.Dispatch<React.SetStateAction<string>>;
}

const goLive = async ({ chatId, name, setToken }: goLiveProps) => {
    try {
        const res = await fetch(
            `/api/livekit?room=${chatId}&username=${name?.current}`
        );
        const data = await res.json();
        console.log(data);
        setToken(data.token);
    } catch (e) {
        console.log(e);
    }
};

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    let name = useRef("");
    const { user } = useUser();
    const [token, setToken] = useState("");

    const [isDisconnectd, setIsDisconnected] = useState(false);

    console.log(chatId);

    useEffect(() => {
        if (user?.firstName && !user?.lastName)
            name.current = user?.firstName;
        else if (!user?.firstName && user?.lastName)
            name.current = user?.lastName;
        else if (!user?.firstName && !user?.lastName)
            name.current = user?.emailAddresses[0].emailAddress.split("@")[0] as string;
        else
            name.current = `${user?.firstName} ${user?.lastName}`;

        goLive({ chatId, name, setToken });
    }, [user?.firstName, user?.lastName, chatId, user?.emailAddresses]);

    if (isDisconnectd) {

        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <RefreshCw className="h-7 w-7 text-zinc-500  my-4" />
                <Button className="text-xl  text-white bg-emerald-500 hover:bg-emerald-400" onClick={() => {
                    setIsDisconnected(false);
                    goLive({ chatId, name, setToken });
                }} >
                    Reconnect
                    <div className="ml-2">
                        {audio && !video && <Mic />}
                        {audio && video && <Video />}
                    </div>
                </Button>
            </div>
        );
    }

    if (token === "") {
        return <div className="flex flex-col flex-1 justify-center items-center">
            <Loader className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Loading...
            </p>
        </div>;

    }

    return (
        // <div className="flex flex-col flex-1 justify-center items-center">
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
            // className="aspect-video w-[calc(20vw * 0.5625)] h-[20vw]"
            onDisconnected={() => {
                setIsDisconnected(true);
            }}
        >
            <VideoConference />
        </LiveKitRoom>
        //  </div>
    );
};
