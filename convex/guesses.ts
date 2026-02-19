import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submitGuess = mutation({
    args: {
        slug: v.string(),
        guestName: v.string(),
        missionId: v.string(),
        missionName: v.string(),
        lat: v.number(),
        lng: v.number(),
    },
    handler: async (ctx, args) => {
        // Look up the event by slug first to get its ID
        const event = await ctx.db
            .query("events")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!event) {
            throw new Error("Event not found");
        }

        // Insert the guess
        await ctx.db.insert("guesses", {
            eventId: event._id,
            guestName: args.guestName,
            missionId: args.missionId,
            missionName: args.missionName,
            lat: args.lat,
            lng: args.lng,
            createdAt: Date.now(),
        });

        return { success: true };
    },
});

export const getGuesses = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const event = await ctx.db
            .query("events")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!event) {
            return [];
        }

        return await ctx.db
            .query("guesses")
            .withIndex("by_event", (q) => q.eq("eventId", event._id))
            .order("desc") // Newest first
            .collect();
    },
});
