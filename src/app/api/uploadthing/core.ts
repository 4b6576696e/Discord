import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@clerk/nextjs"

const f = createUploadthing()

const handleAuth = () => {
    const { userId } = auth()
    if (!userId) throw new Error("Unauthorized")
    return { userId: userId }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    attachmentFile: f({
        image: {
            maxFileCount: 1,
            maxFileSize: "32MB",
        },
        pdf: {
            maxFileCount: 1,
            maxFileSize: "32MB",
        },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
