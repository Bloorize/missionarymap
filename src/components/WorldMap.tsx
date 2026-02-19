"use client"

import React, { useMemo } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

// Simple world topology URL (using a reliable CDN or local file would be better, but this is standard for react-simple-maps)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface WorldMapProps {
    slug: string
}

export function WorldMap({ slug }: WorldMapProps) {
    const guesses = useQuery(api.guesses.getGuesses, { slug }) || []

    // Memoize the markers to avoid re-rendering the heavy map unnecessarily
    // changing only when guesses change
    const markers = useMemo(() => {
        return guesses.map((g) => ({
            id: g._id,
            name: g.guestName,
            coordinates: [g.lng, g.lat] as [number, number],
            timestamp: g.createdAt,
        }))
    }, [guesses])

    // Find the newest guess to highlight
    const newestGuessId = markers.length > 0 ? markers[0].id : null

    return (
        <div className="w-full h-screen bg-[#0a0e1a] overflow-hidden relative">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 140,
                }}
                className="w-full h-full"
            >
                <ZoomableGroup center={[0, 20]} zoom={1} maxZoom={4} minZoom={0.7}>
                    <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#1a2333"
                                    stroke="#2a3b55"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#243045", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    <AnimatePresence>
                        {markers.map(({ id, name, coordinates, timestamp }) => {
                            const isNew = id === newestGuessId && (Date.now() - timestamp < 10000); // Only highlight if < 10s old

                            return (
                                <Marker key={id} coordinates={coordinates}>
                                    {/* Pin visual */}
                                    <motion.circle
                                        r={4}
                                        fill={isNew ? "#22d3a5" : "#f5c842"} // Green for new, Gold for old
                                        stroke="#fff"
                                        strokeWidth={1}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    />

                                    {/* Pulse effect for new pins */}
                                    {isNew && (
                                        <motion.circle
                                            r={10}
                                            fill="none"
                                            stroke="#22d3a5"
                                            strokeWidth={1}
                                            initial={{ scale: 0.5, opacity: 1 }}
                                            animate={{ scale: 2, opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}

                                    {/* Name Label - shows permanently for new, or could be hover */}
                                    {isNew && (
                                        <motion.text
                                            textAnchor="middle"
                                            y={-10}
                                            style={{ fontFamily: "system-ui", fill: "#fff", fontSize: "10px", fontWeight: "bold", textShadow: "0px 1px 3px rgba(0,0,0,0.8)" }}
                                            initial={{ opacity: 0, y: 0 }}
                                            animate={{ opacity: 1, y: -10 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {name}
                                        </motion.text>
                                    )}
                                </Marker>
                            )
                        })}
                    </AnimatePresence>
                </ZoomableGroup>
            </ComposableMap>

            {/* Overlay Stats */}
            <div className="absolute bottom-10 left-10 bg-black/50 backdrop-blur-md p-4 rounded-lg text-white border border-white/10">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Total Guesses</h3>
                <p className="text-4xl font-bold">{markers.length}</p>
            </div>
        </div>
    )
}
