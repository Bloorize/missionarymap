import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to generate random 6-character slug
function generateSlug() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const getEvent = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const event = await ctx.db
            .query("events")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
        return event;
    },
});

export const createEvent = mutation({
    args: { title: v.string(), youthName: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        console.log("Mutation received. Identity:", identity);
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const slug = generateSlug();

        const eventId = await ctx.db.insert("events", {
            hostId: identity.subject,
            title: args.title,
            youthName: args.youthName,
            slug,
            createdAt: Date.now(),
            isRevealed: false,
        });

        return { eventId, slug };
    },
});

export const getMyEvents = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        return await ctx.db
            .query("events")
            .withIndex("by_host", (q) => q.eq("hostId", identity.subject))
            .order("desc")
            .collect();
    },
});

export const revealMission = mutation({
    args: { eventId: v.id("events"), actualMission: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const event = await ctx.db.get(args.eventId);
        if (!event || event.hostId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.eventId, {
            isRevealed: true,
            actualMission: args.actualMission,
        });
    },
});
