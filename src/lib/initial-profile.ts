import { currentUser, redirectToSignIn } from "@clerk/nextjs"
import db from "@/lib/db"
import { notFound } from "next/navigation"

async function initialProfile() {
    try {
        const user = await currentUser()

        if (!user) {
            return redirectToSignIn()
        }

        const profile = await db.profile.findUnique({
            where: {
                userId: user.id,
            },
            include: {
                history: {
                    orderBy: {
                        updatedAt: "desc",
                    },
                },
            },
        })

        if (profile) {
            return profile
        }

        const userName =
            user.firstName + (user.lastName ? " " + user.lastName : "")

        const newProfile = await db.profile.create({
            data: {
                userId: user.id,
                imageUrl: user.imageUrl,
                name: userName,
                email: user.emailAddresses[0].emailAddress,
            },
            include: {
                history: {
                    orderBy: {
                        updatedAt: "asc",
                    },
                },
            },
        })

        return newProfile
    } catch (error) {
        console.log(error)
        notFound()
    }
}

export default initialProfile
