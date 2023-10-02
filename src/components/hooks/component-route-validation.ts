import db from "@/lib/db"
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

type Props = {
    history?: Boolean
}

export const isAuth = async (props?: Props) => {
    const { userId } = auth()

    if (!userId) return redirectToSignIn()

    let profile

    if (props?.history) {
        profile = await db.profile.findUnique({
            where: {
                userId,
            },
            include: {
                history: {
                    orderBy: {
                        updatedAt: "asc",
                    },
                },
            },
        })
    } else {
        profile = await db.profile.findUnique({
            where: {
                userId,
            },
        })
    }

    if (!profile) return redirect("/")

    return profile
}
