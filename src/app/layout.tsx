import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TrpcProvider } from '@/components/providers/trpc-provider';
import ModalProvider from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';

// import ProgressBar from '@/components/providers/progress-bar';
const font = Open_Sans({ subsets: ["latin"], weight: ['400', '700', '500', '300'] });

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
    title: '🇩.🇮.🇸.🇨. 🅾️. 🇷. 🇩',
    description: 'Created by Kevin G',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider afterSignInUrl='/' afterSignUpUrl='/'>
            <html lang="en" suppressHydrationWarning>
                {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
                <body className={cn(
                    font.className,
                    "bg-white dark:bg-[#313338]")}>
                    <ThemeProvider
                        attribute="class" defaultTheme="dark" enableSystem={false} storageKey="discord-theme"
                    >
                        <SocketProvider>
                            <TrpcProvider>
                                <ModalProvider />
                                {/* <Suspense fallback={<LoadingNavigationSidebar />}> */}
                                {children}
                                {/* </Suspense> */}
                            </TrpcProvider>
                        </SocketProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
