import React from 'react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import Loader from './loader';

type Props = {};

function LoadingNavigationSidebar({ }: Props) {

    const dummyServer = new Array(5).fill(0);

    return (
        <div
            className='hidden md:flex flex-col space-y-4  items-center w-full h-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3 text-primary'
        >
            <Loader className='flex mx-3 h-[48px] w-[48px] rounded-[24px] ' />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ScrollArea
                className='flex-1 w-full'
            >
                {dummyServer.map((_, index) =>
                    <>
                        <div key={index} className="relative flex items-center mb-4">
                            <Loader className={`absolute left-0 rounded-r-full w-[4px] h-[${index == 0 ? 36 : 8}px]`} />
                            <Loader className='relative mx-3 h-[48px] w-[48px] rounded-[24px]  ' />
                        </div>
                    </>

                )}
            </ScrollArea>


            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <Loader className='w-[48px] h-[48px] rounded-full' />
                <Loader className='w-[48px] h-[48px] rounded-full' />
            </div>

        </div>
    );
}

export default LoadingNavigationSidebar;