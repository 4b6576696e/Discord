"use client";

import { SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

export const SocketIndicator = () => {
    const { isConnected } = useSocket();

    const [haveNetworkConnection, setHaveNetworkConnection] = useState(false);

    useEffect(() => {
        const setOnline = () => {
            console.log(navigator.onLine);

            setHaveNetworkConnection(true);
        };
        const setOffline = () => {
            console.log(navigator.onLine);

            setHaveNetworkConnection(false);
        };

        window.addEventListener("online", setOnline);

        window.addEventListener("offline", setOffline);

        setOnline();
        return () => {
            window.removeEventListener("online", setOnline);
            window.removeEventListener("offline", setOffline);
        };
    }, []);

    if (!haveNetworkConnection) {
        return <>
            <SignalLow className="text-rose-500  border-none" />
        </>;
    }

    if (!isConnected) {
        return (
            <SignalMedium className="text-yellow-600  border-none" />
        );
    }

    return (
        <SignalHigh className="text-emerald-400  border-none" />
    );
};