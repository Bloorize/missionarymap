"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

/**
 * Temporary debug: decode the Convex JWT to see iss/aud.
 * Add to dashboard, check production, then remove.
 */
export function TokenDebug() {
    const { getToken, isSignedIn } = useAuth();
    const [payload, setPayload] = useState<{ iss?: string; aud?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isSignedIn) return;
        getToken({ template: "convex" })
            .then((token) => {
                if (!token) {
                    setError("No token from getToken({ template: 'convex' })");
                    return;
                }
                try {
                    const payloadB64 = token.split(".")[1];
                    const payload = JSON.parse(atob(payloadB64));
                    setPayload({ iss: payload.iss, aud: payload.aud });
                } catch {
                    setError("Could not decode token");
                }
            })
            .catch((err) => setError(err?.message || "Failed"));
    }, [getToken, isSignedIn]);

    if (!isSignedIn || (!payload && !error)) return null;

    return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-6">
            <p className="font-semibold mb-2">Token debug (remove when fixed)</p>
            {error ? (
                <p className="text-red-700">{error}</p>
            ) : (
                <pre className="text-xs overflow-auto">
                    iss: {payload?.iss ?? "—"}
                    {"\n"}aud: {payload?.aud ?? "—"}
                </pre>
            )}
            <p className="mt-2 text-amber-700 text-xs">
                Convex expects iss=https://wealthy-beetle-0.clerk.accounts.dev, aud=convex
            </p>
        </div>
    );
}
