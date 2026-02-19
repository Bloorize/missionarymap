"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { getGuesses } from "@/lib/guesses";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 8;

interface WorldMapProps {
  slug: string;
}

export function WorldMap({ slug }: WorldMapProps) {
  const [guesses, setGuesses] = useState<Awaited<ReturnType<typeof getGuesses>>>([]);
  const [position, setPosition] = useState({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });

  useEffect(() => {
    const load = () => getGuesses(slug).then(setGuesses);
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [slug]);

  const handleMoveEnd = useCallback(
    (pos: { coordinates: [number, number]; zoom: number }) => {
      setPosition({ coordinates: pos.coordinates, zoom: pos.zoom });
    },
    []
  );

  const handleZoomIn = useCallback(() => {
    setPosition((p) => ({
      ...p,
      zoom: Math.min(MAX_ZOOM, p.zoom * 1.5),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPosition((p) => ({
      ...p,
      zoom: Math.max(MIN_ZOOM, p.zoom / 1.5),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  }, []);

  const markers = useMemo(() => {
    return guesses.map((g) => ({
      id: g.id,
      name: g.guest_name,
      coordinates: [g.lng, g.lat] as [number, number],
      timestamp: new Date(g.created_at).getTime(),
    }));
  }, [guesses]);

  const newestGuessId = markers.length > 0 ? markers[0].id : null;

  return (
    <div className="w-full h-screen bg-[#0a0e1a] overflow-hidden relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140 }}
        className="w-full h-full"
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={handleMoveEnd}
        >
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
              const isNew = id === newestGuessId && Date.now() - timestamp < 10000;

              return (
                <Marker key={id} coordinates={coordinates}>
                  <motion.circle
                    r={4}
                    fill={isNew ? "#22d3a5" : "#f5c842"}
                    stroke="#fff"
                    strokeWidth={1}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
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
                  {isNew && (
                    <motion.text
                      textAnchor="middle"
                      y={-10}
                      style={{
                        fontFamily: "system-ui",
                        fill: "#fff",
                        fontSize: "10px",
                        fontWeight: "bold",
                        textShadow: "0px 1px 3px rgba(0,0,0,0.8)",
                      }}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -10 }}
                      exit={{ opacity: 0 }}
                    >
                      {name}
                    </motion.text>
                  )}
                </Marker>
              );
            })}
          </AnimatePresence>
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-10 left-10 bg-black/50 backdrop-blur-md p-4 rounded-lg text-white border border-white/10">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Total Guesses</h3>
        <p className="text-4xl font-bold">{markers.length}</p>
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-3 bg-black/50 backdrop-blur-md rounded-lg text-white border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-3 bg-black/50 backdrop-blur-md rounded-lg text-white border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="p-3 bg-black/50 backdrop-blur-md rounded-lg text-white border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Reset view"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40">
        Scroll to zoom • Drag to pan
      </p>
    </div>
  );
}
