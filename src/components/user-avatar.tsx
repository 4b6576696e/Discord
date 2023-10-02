import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type Props = {
    imageUrl?: string;
    className?: string;
};

function UserAvatar({ imageUrl, className }: Props) {
    return (
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            className
        )}>
            <AvatarImage src={imageUrl} />
        </Avatar>
    );
}

export default UserAvatar;