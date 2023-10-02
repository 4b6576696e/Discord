"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, getFetch, loggerLink } from "@trpc/client";
import { cache, useState } from "react";
import superjson from "superjson";
import { trpc } from "@/_trpc/client";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from "../react-query/getQueryClient";

export const qc = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
});

export const TrpcProvider: React.FC<{ children: React.ReactNode; }> = ({
    children,
}) => {
    // console.log(getQueryClient());
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: { queries: { staleTime: 5000 } },
        })
    );
    // const queryClient = qc;

    const url = process.env.NEXT_PUBLIC_SITE_URL
        ? `https://${process.env.NEXT_PUBLIC_SITE_URL}/api/trpc`
        : "http://localhost:3000/api/trpc/";

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                loggerLink({
                    enabled: () => true,
                }),
                httpBatchLink({
                    url,
                    fetch: async (input, init?) => {
                        const fetch = getFetch();
                        return fetch(input, {
                            ...init,
                            credentials: "include",
                        });
                    },
                }),
            ],
            transformer: superjson,
        })
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools
                    position="bottom-right"
                />
            </QueryClientProvider>
        </trpc.Provider>
    );
};
