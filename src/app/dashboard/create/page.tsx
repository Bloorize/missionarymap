"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Need to create Label ui or import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Need Card ui
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
    const router = useRouter();
    const createEvent = useMutation(api.events.createEvent);

    const [title, setTitle] = useState("");
    const [youthName, setYouthName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !youthName) return;

        setIsSubmitting(true);
        try {
            const { eventId } = await createEvent({ title, youthName });
            router.push(`/dashboard/events/${eventId}`);
        } catch (error) {
            console.error("Failed to create event:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-lg">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900 mb-6 inline-flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>Set up a mission call guessing party.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="title">
                                Event Title
                            </label>
                            <Input
                                id="title"
                                placeholder="e.g. Carl's Mission Call"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="youthName">
                                Youth Name
                            </label>
                            <Input
                                id="youthName"
                                placeholder="e.g. Elder Smith"
                                value={youthName}
                                onChange={(e) => setYouthName(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Creating..." : "Create Event"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
