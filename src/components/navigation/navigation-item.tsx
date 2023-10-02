"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { memo, useCallback, useEffect } from "react";
import ActionTooltip from '../action-tooltip';
import Link from "next/link";
import { VisitedName } from "@prisma/client";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
    channelId: string;
    memberId: string;
    subRoute: VisitedName;
};

function NavigationItem({
    id,
    imageUrl,
    name,
    channelId,
    memberId,
    subRoute
}: NavigationItemProps) {
    const params = useParams();
    const router = useRouter();

    let url = `/servers/${id}`;

    if (subRoute === VisitedName.Channel)
        url += `/channels/${channelId}`;
    else if (subRoute === VisitedName.Member)
        url += `/members/${memberId}`;

    useEffect(() => {
        router.prefetch(url);
    }, [url, router]);

    const clickHandler = useCallback(() => {
        // sheetIsOpen.value = false;
        router.push(url);
    }, [url, router]);


    return (
        <ActionTooltip
            side="right"
            align="center"
            label={name}
        >
            <button
                onClick={clickHandler}
                className="group relative flex items-center"
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )} />
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image
                        placeholder="blur"
                        blurDataURL={imageUrl}
                        src={imageUrl}
                        alt="Channel"
                        className="object-cover"
                        width={48}
                        height={48}
                    />
                </div>
            </button>
        </ActionTooltip>
    );
}

export default memo(NavigationItem);