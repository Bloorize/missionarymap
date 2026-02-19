This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Convex + Clerk Setup (Local & Production)

### How it works

- **Convex** has two deployments per project: **dev** and **prod** (separate databases).
- **Local**: `npm run dev` → Next.js uses `NEXT_PUBLIC_CONVEX_URL` from `.env.local` → usually points to Convex **dev**.
- **Production**: Deployed app uses `NEXT_PUBLIC_CONVEX_URL` from your host (e.g. Vercel) → usually points to Convex **prod**.

Both deployments need the same Clerk auth config. The auth domain is set in Convex (not Next.js).

### One-time setup

1. **Convex**: Run `npx convex dev` to create/link your project. This writes `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.
2. **Clerk**: Create a JWT template named `convex` in [Clerk Dashboard → JWT Templates](https://dashboard.clerk.com/last-active?path=jwt-templates). Copy the **Issuer URL**.
3. **Convex Dashboard**: For **both** dev and prod:
   - Go to [dashboard.convex.dev](https://dashboard.convex.dev) → your project
   - Switch deployment (dev/prod) in the left sidebar
   - Settings → Environment Variables → add `CLERK_JWT_ISSUER_DOMAIN` = your Clerk Issuer URL
4. Run `npx convex dev` again to sync the auth config.

### Environment variables

| Variable | Where | Used by |
|----------|-------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` (local) / Vercel (prod) | Next.js – which Convex backend to call |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Same | Next.js – Clerk auth |
| `CLERK_SECRET_KEY` | Same | Next.js – Clerk auth (server) |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex Dashboard (per deployment) | Convex – which Clerk JWT issuer to trust |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
