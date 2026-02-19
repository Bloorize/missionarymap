"use client"

import * as React from "react"
import { Search, Check, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ALL_MISSIONS } from "@/data/missions"

interface MissionComboboxProps {
    value: string
    onChange: (value: string) => void
}

export function MissionCombobox({ value, onChange }: MissionComboboxProps) {
    const [search, setSearch] = React.useState("")
    const [isFocused, setIsFocused] = React.useState(false)

    // Find current mission
    const selectedMission = React.useMemo(() =>
        ALL_MISSIONS.find((m) => m.id === value),
        [value]
    )

    // Filter missions based on search
    const filteredMissions = React.useMemo(() => {
        if (!search) return []
        const s = search.toLowerCase()
        return ALL_MISSIONS.filter(m =>
            m.name.toLowerCase().includes(s)
        ).slice(0, 8) // Limit to top 8 for speed/space
    }, [search])

    return (
        <div className="relative w-full space-y-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                    placeholder="Type to search mission..."
                    value={search || (selectedMission?.name || "")}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        // Clear selection if they start typing a new search
                        if (value) onChange("")
                    }}
                    onFocus={() => setIsFocused(true)}
                    className="pl-10 h-12 text-lg bg-white border-slate-200"
                />
            </div>

            {isFocused && filteredMissions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[250px] overflow-y-auto">
                        {filteredMissions.map((mission) => (
                            <button
                                key={mission.id}
                                type="button"
                                className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-blue-50 active:bg-blue-100 border-b border-slate-50 last:border-0 transition-colors"
                                onClick={() => {
                                    onChange(mission.id)
                                    setSearch(mission.name)
                                    setIsFocused(false)
                                }}
                            >
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                                    <span className="font-medium text-slate-900">{mission.name}</span>
                                </div>
                                {value === mission.id && <Check className="w-5 h-5 text-blue-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isFocused && search && filteredMissions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg p-4 text-center text-slate-500 shadow-xl">
                    No missions found for "{search}"
                </div>
            )}
        </div>
    )
}
