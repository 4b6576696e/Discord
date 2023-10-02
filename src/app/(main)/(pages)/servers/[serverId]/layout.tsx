
import LoadingServerSidebar from '@/components/loading/loading-server-sidebar';
import ServerSidebarPrefetch from '@/components/server/server-sidebar-prefetch';
import React, { Suspense } from 'react';

export const dynamic = "force-dynamic";


async function layout({ children, params: { serverId } }: {
    children: React.ReactNode;
    params: { serverId: string; };
}) {
    console.log("[sever sidebar]");

    return (
        <div className='h-full'>
            <div
                className="mobile md:block h-full w-60 z-20 flex-col fixed inset-y-0">
                <Suspense fallback={<LoadingServerSidebar />}>
                    <ServerSidebarPrefetch serverId={serverId} />
                </Suspense>
            </div>
            <main className="md:pl-60 h-full">
                {children}
            </main>
        </div>
    );
}

export default layout;