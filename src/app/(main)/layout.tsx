import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import React, { Suspense } from 'react';
import LoadingNavigationSidebar from '@/components/loading/loading-nav-sidebar';
import NavigationSidebarPrefetch from '@/components/navigation/navigation-sidebar-prefetch';

export const dynamic = "force-dynamic";


function layout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className='h-full'>
            <div
                className='mobile md:block w-[72px] h-full fixed inset-y-0 z-30'
            >
                <Suspense fallback={<LoadingNavigationSidebar />}>
                    <NavigationSidebarPrefetch />
                </Suspense>
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
    );
}

export default layout;