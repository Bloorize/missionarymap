# MissionMap Live

MissionMap Live is a Next.js app for mission call guessing parties. Guests submit guesses on a live map, and hosts can now authenticate with Clerk and broadcast the mission call to signed-in viewers.

## Stack

- Next.js App Router
- Clerk for authentication
- Supabase for event and guess data
- LiveKit Cloud for one-way livestreaming
- Tailwind CSS + Radix UI primitives

## Environment Variables

Set these in `.env.local` for local development and in your deployment platform for production:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase browser key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase access for protected event operations |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_SECRET_KEY` | Clerk backend secret |
| `CLERK_SIGN_IN_URL` | Clerk sign-in route, usually `/sign-in` |
| `CLERK_SIGN_UP_URL` | Clerk sign-up route, usually `/sign-up` |
| `NEXT_PUBLIC_LIVEKIT_URL` | LiveKit websocket URL |
| `LIVEKIT_API_KEY` | LiveKit server API key |
| `LIVEKIT_API_SECRET` | LiveKit server API secret |
| `LIVEKIT_WEBHOOK_SECRET` | Secret for validating LiveKit webhooks |

## Local Development

1. Install dependencies.
2. Apply the Supabase migrations in `supabase/migrations`.
3. Configure Clerk and LiveKit env vars.
4. Run the app:

```bash
npm run dev
```

## Current Streaming MVP

- Hosts must sign in with Clerk to create and manage events.
- Guests can still join and submit guesses anonymously.
- Signed-in viewers can watch the livestream from `/live/[slug]`.
- Recording and replay are intentionally deferred until storage is configured.
