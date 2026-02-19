"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ALL_MISSIONS, Mission } from "@/data/missions"

interface MissionComboboxProps {
    value: string
    onChange: (value: string) => void
}

export function MissionCombobox({ value, onChange }: MissionComboboxProps) {
    const [open, setOpen] = React.useState(false)

    // Memoize the mission lookup for performance since it's large
    const selectedMission = React.useMemo(() =>
        ALL_MISSIONS.find((mission) => mission.id === value),
        [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-12 text-left font-normal"
                >
                    <span className="truncate">
                        {selectedMission ? selectedMission.name : "Select mission..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search mission..." className="h-12" />
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>No mission found.</CommandEmpty>
                        <CommandGroup>
                            {ALL_MISSIONS.map((mission) => (
                                <CommandItem
                                    key={mission.id}
                                    value={`${mission.name} ${mission.id}`} // Search by both
                                    onSelect={() => {
                                        console.log("Selected mission:", mission.id);
                                        onChange(mission.id);
                                        setOpen(false);
                                    }}
                                    className="py-3 cursor-pointer" // Larger tap target
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === mission.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {mission.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
