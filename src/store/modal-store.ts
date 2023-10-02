import { create } from "zustand"
import { Channel, ChannelType } from "@prisma/client"
import { ServerwithMembersWithProfile } from "../../types"

export type ModalType =
    | "create-server"
    | "invite-people"
    | "edit-server"
    | "manage-member"
    | "create-channel"
    | "delete-server"
    | "leave-server"
    | "edit-channel"
    | "delete-channel"
    | "attachment-file"
    | "delete-message"

interface ModalData {
    server?: ServerwithMembersWithProfile
    // channelType?: ChannelType
    profileId?: string
    channel?: Channel
    apiUrl?: string
    query?: Record<string, any>
    redirectTo?: string
}

interface ModalStore {
    type: ModalType | null
    data: ModalData
    isOpen: boolean
    onOpen: (type: ModalType, data?: ModalData) => void
    onClose: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
    data: {},
    type: null,
    isOpen: false,
    onOpen(type, data = {}) {
        set({
            isOpen: true,
            data,
            type,
        })
    },
    onClose() {
        set({ isOpen: false, type: null, data: {} })
    },
}))
