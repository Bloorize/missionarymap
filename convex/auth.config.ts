import { AuthConfig } from "convex/server";

export default {
    providers: [
        {
            // Must match your Clerk app's Frontend API URL. Set CLERK_JWT_ISSUER_DOMAIN
            // in the Convex Dashboard (Settings → Environment Variables).
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
            applicationID: "convex",
        },
    ],
} satisfies AuthConfig;
