"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, ArrowRight, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const events = useQuery(api.events.getMyEvents);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="border-b border-slate-200 bg-white">
                <div className="container mx-auto py-8 px-4 max-w-5xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Events</h1>
                            <p className="text-slate-500 mt-2">Manage your mission call parties.</p>
                        </div>
                        <Link href="/dashboard/create">
                            <Button size="lg">
                                <Plus className="mr-2 h-5 w-5" /> New Event
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-10 px-4 max-w-5xl">
                {!events ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                        <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No events yet</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            Get the party started by creating your first mission call event.
                        </p>
                        <Link href="/dashboard/create">
                            <Button variant="outline">Create Event</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Link key={event._id} href={`/dashboard/events/${event._id}`}>
                                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full border-slate-200 bg-white">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl font-bold line-clamp-1 text-slate-900">{event.title}</CardTitle>
                                            {event.isRevealed && (
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                    Revealed
                                                </span>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-500 mb-4">
                                            For: <span className="font-medium text-slate-700">{event.youthName}</span>
                                        </p>
                                        <div className="flex items-center justify-between mt-4 text-sm text-primary font-medium">
                                            <span>Manage Event</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
