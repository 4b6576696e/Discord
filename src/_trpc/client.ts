import { type AppRouter } from "@/server"
import { createTRPCReact } from "@trpc/react-query"

export const dynamic = "force-dynamic"

export const trpc = createTRPCReact<AppRouter>({})
