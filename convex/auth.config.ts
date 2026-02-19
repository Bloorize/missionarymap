import { AuthConfig } from "convex/server";

/**
 * Convex auth config for Clerk.
 *
 * LOCAL vs PROD:
 * - Convex has two deployments: "dev" and "prod" (separate databases).
 * - Your local app (npm run dev) typically uses Convex DEV via NEXT_PUBLIC_CONVEX_URL.
 * - Your deployed app uses Convex PROD.
 * - Set CLERK_JWT_ISSUER_DOMAIN in BOTH deployments in Convex Dashboard:
 *   Settings → Environment Variables (switch dev/prod in the sidebar).
 *
 * To get your Clerk Issuer URL: Clerk Dashboard → JWT Templates → Convex template → Issuer URL.
 * If unset, falls back to the default (works if you use the template's Clerk instance).
 */
const clerkDomain =
    process.env.CLERK_JWT_ISSUER_DOMAIN || "https://wealthy-beetle-0.clerk.accounts.dev";

export default {
    providers: [
        {
            domain: clerkDomain,
            applicationID: "convex",
        },
    ],
} satisfies AuthConfig;
