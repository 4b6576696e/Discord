'use client';

import { Loader, ServerCrash } from "lucide-react";


export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {

    if (error.message === "Error in body stream")
        return <html>
            <body className="bg-white dark:bg-[#313338]">
                <div className="flex flex-col flex-1 justify-center items-center h-full">
                    <Loader className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Loading...
                    </p>
                </div>
            </body>
        </html>;

    return (
        <html>
            <body className="bg-white dark:bg-[#313338]">
                <div className="flex flex-col flex-1 justify-center items-center h-full">
                    <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Something went wrong!
                    </p>
                </div>
            </body>
        </html>
    );
}
