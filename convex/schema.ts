import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    events: defineTable({
        hostId: v.string(), // Clerk user ID
        title: v.string(),
        youthName: v.string(),
        slug: v.string(), // Random 6-char string
        createdAt: v.number(),
        isRevealed: v.boolean(),
        actualMission: v.optional(v.string()), // Mission ID
    })
        .index("by_slug", ["slug"])
        .index("by_host", ["hostId"]),

    guesses: defineTable({
        eventId: v.id("events"),
        guestName: v.string(),
        missionId: v.string(), // From our missions data
        missionName: v.string(),
        lat: v.number(),
        lng: v.number(),
        createdAt: v.number(),
    })
        .index("by_event", ["eventId"]),
});
