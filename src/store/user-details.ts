import { create } from "zustand"
import { ServerwithMembersWithProfile } from "../../types"
import { Server } from "@prisma/client"

interface User {
    server: ServerwithMembersWithProfile | null
    profileId: string
    setProfileId: (id: string) => void
    setServer: (server: ServerwithMembersWithProfile) => void
}

export const useUser = create<User>((set) => ({
    server: null,
    profileId: "",
    setProfileId(id) {
        set({
            profileId: id,
        })
    },
    setServer(server) {
        set({
            server,
        })
    },
}))
