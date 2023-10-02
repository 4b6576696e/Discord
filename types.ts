import { Server, Member, Profile, Channel, History } from "@prisma/client"
import { NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"
import { Server as NetServer, Socket } from "net"

export type ServerwithMembersWithProfile = Server & {
    members: (Member & {
        profile: Profile
    })[]
}

export type ServerWithChannels = Server & { channels: Channel[] }
export type ProfileWithHistory = Profile & { history: History[] }
export type MemberWithProfile = Member & { profile: Profile }

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}
