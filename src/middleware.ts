// import { authMiddleware } from "@clerk/nextjs"

import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"
// import Router from "next/router"

export default authMiddleware({
    publicRoutes: ["/api/uploadthing"],
})

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
// export default authMiddleware({

// })

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
