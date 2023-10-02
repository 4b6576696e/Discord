import { Loader } from 'lucide-react';
import React from 'react';

type Props = {};

function Loading({ }: Props) {
    return (
        <div className="flex flex-col flex-1 justify-center items-center h-full">
            <Loader className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Loading...
            </p>
        </div>
    );
}

export default Loading;