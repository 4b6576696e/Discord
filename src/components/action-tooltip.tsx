import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Props = {
    children: React.ReactNode;
    label: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
};

function ActionTooltip({ children, label, side, align }: Props) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className='font-semibold text-sm capitalize'>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default ActionTooltip;