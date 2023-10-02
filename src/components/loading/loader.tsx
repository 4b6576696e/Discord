import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    children?: React.ReactElement;
};

function Loader({ className, children }: Props) {
    return (
        <Skeleton className={cn(
            " bg-zinc-100 dark:bg-zinc-700",
            className
        )} >
            {children}
        </Skeleton>
    );
}

export default Loader;