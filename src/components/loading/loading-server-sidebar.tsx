import React from 'react';
import Loader from './loader';
import { Separator } from '../ui/separator';
import { ChevronDown, Plus, Settings } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type Props = {};

function LoadingServerSidebar({ }: Props) {
    return (
        <div className='h-full'>
            <div
                className="mobile md:block h-full w-60 z-20 flex-col fixed inset-y-0">
                <div
                    className='flex flex-col w-full h-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]'
                >
                    <div className="p-3 w-full font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2  ">
                        <Loader className="w-full h-full" />
                        <Skeleton className="bg-transparent pl-4">
                            <ChevronDown className="h-5 w-5 ml-auto shrink-0 text-[#6d7079]" />
                        </Skeleton>
                    </div>
                    <div className="mt-2 px-3 h-full">

                        <Loader className="w-full h-7" />
                        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                        {Array(3).fill(0).map((_, i) => <div key={i} className="mb-2">
                            <div className="py-2 w-full flex items-center">
                                <Loader className="w-full h-7" />
                                <Skeleton className="bg-transparent pl-4">
                                    <Plus className="h-5 w-5 ml-auto shrink-0 text-[#6d7079]" />
                                </Skeleton>
                            </div>
                            {Array(3).fill(0).map((_, i) => <div key={i}
                                className="px-2 py-2 rounded-md flex items-center gap-x-2 w-full  mb-1"
                            >
                                <Loader className="w-28 h-4" />
                            </div>)}
                        </div>)}

                        <div className="mb-2">
                            <div className="py-2 w-full flex items-center">
                                <Loader className="w-full h-7" />
                                <Skeleton className="bg-transparent pl-4">
                                    <Settings className="h-5 w-5 ml-auto shrink-0 text-[#6d7079]" />
                                </Skeleton>
                            </div>
                            {Array(3).fill(0).map((_, i) => <div key={i}
                                className="px-2 py-2 rounded-md flex items-center gap-x-2 w-full  mb-1"
                            >
                                <Loader className='w-8 h-8 rounded-full' />
                                <Loader className="w-20 h-4" />
                            </div>)}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoadingServerSidebar;