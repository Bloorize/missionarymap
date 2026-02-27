"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { getGuesses } from "@/lib/guesses";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { GuessRecord } from "@/lib/types";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const US_STATES_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const CANADA_PROVINCES_URL = "https://cdn.jsdelivr.net/gh/returnOfTheYeti/CanadaJSON@master/canada.topo.json";
const MEXICO_STATES_URL = "https://cdn.jsdelivr.net/gist/diegovalle/5129746/c1c35e439b1d5e688bca20b79f0e53a1fc12bf9e/mx_tj.json";

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 8;

interface WorldMapProps {
  slug: string;
}

export function WorldMap({ slug }: WorldMapProps) {
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [position, setPosition] = useState({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });

  useEffect(() => {
    const load = () => getGuesses(slug).then(setGuesses).catch(() => setGuesses([]));
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [slug]);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition({ coordinates: pos.coordinates, zoom: pos.zoom });
  }, []);

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
      missionName: g.mission_name,
      coordinates: [g.lng, g.lat] as [number, number],
      timestamp: new Date(g.created_at).getTime(),
    }));
  }, [guesses]);

  const newestGuessId = markers.length > 0 ? markers[0].id : null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0e1a]">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }} className="h-full w-full">
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM} onMoveEnd={handleMoveEnd}>
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

          <Geographies geography={US_STATES_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={`us-${geo.rsmKey}`}
                  geography={geo}
                  fill="transparent"
                  stroke="#3a4b65"
                  strokeWidth={0.4}
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                />
              ))
            }
          </Geographies>
          <Geographies geography={CANADA_PROVINCES_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={`ca-${geo.rsmKey}`}
                  geography={geo}
                  fill="transparent"
                  stroke="#3a4b65"
                  strokeWidth={0.4}
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                />
              ))
            }
          </Geographies>
          <Geographies geography={MEXICO_STATES_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={`mx-${geo.rsmKey}`}
                  geography={geo}
                  fill="transparent"
                  stroke="#3a4b65"
                  strokeWidth={0.4}
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                />
              ))
            }
          </Geographies>

          <AnimatePresence>
            {markers.map(({ id, name, missionName, coordinates, timestamp }) => {
              const isNew = id === newestGuessId && Date.now() - timestamp < 10000;
              const pinScale = 1 / position.zoom;

              return (
                <Marker key={id} coordinates={coordinates}>
                  <g transform={`scale(${pinScale})`}>
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
                    {isNew ? (
                      <motion.circle
                        r={10}
                        fill="none"
                        stroke="#22d3a5"
                        strokeWidth={1}
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    ) : null}
                    <text
                      textAnchor="middle"
                      y={-12}
                      style={{
                        fontFamily: "system-ui",
                        fill: "#fff",
                        fontSize: "10px",
                        fontWeight: "bold",
                        textShadow: "0px 1px 3px rgba(0,0,0,0.8)",
                        pointerEvents: "none",
                      }}
                    >
                      {name}
                    </text>
                    <text
                      textAnchor="middle"
                      y={-2}
                      style={{
                        fontFamily: "system-ui",
                        fill: "rgba(255,255,255,0.8)",
                        fontSize: "8px",
                        textShadow: "0px 1px 2px rgba(0,0,0,0.8)",
                        pointerEvents: "none",
                      }}
                    >
                      {missionName}
                    </text>
                  </g>
                </Marker>
              );
            })}
          </AnimatePresence>
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-10 right-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleZoomIn}
          className="rounded-lg border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/10"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="rounded-lg border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/10"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/10"
          aria-label="Reset view"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40">Scroll to zoom • Drag to pan</p>
    </div>
  );
}
