"use client";


import { ServerCrash } from 'lucide-react';
import React from 'react';

type Props = {
    error: Error;
    reset: () => void;
};

function Error({ error, reset }: Props) {
    return (
        <div className="flex flex-col flex-1 justify-center items-center h-full">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Something went wrong!
            </p>
        </div>
    );
}

export default Error;
