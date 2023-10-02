import { Server, History } from "@prisma/client"
import { create } from "zustand"

interface NavigationServer {
    servers: { server: Server; history: History }[]
    setServer: (data: { server: Server; history: History }[]) => void
}

export const useNavServer = create<NavigationServer>((set) => ({
    servers: [],
    setServer(data) {
        set({
            servers: data,
        })
    },
}))
