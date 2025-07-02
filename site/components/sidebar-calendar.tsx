"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

function parseDateLocal(string?: string): Date | undefined {
    if (!string) return undefined;
    const [y, m, d] = string.split('-').map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
}

export default function SidebarCalendar() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const from = parseDateLocal(searchParams.get("from") || undefined)
    const to = parseDateLocal(searchParams.get("to") || undefined)
    const dateRange: DateRange | undefined = from && to ? { from, to } : undefined

    function setDateRange(range: DateRange | undefined) {
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        
        if (range?.from) {
            params.set("from", range.from.toLocaleDateString())
        } else {
            params.delete("from")
        }

        if (range?.to) {
            params.set("to", range.to.toLocaleDateString())
        } else {
            params.delete("to")
        }

        router.replace("?" + params.toString())
    }

    return (
        <div className="mb-2">
            <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                className="bg-transparent w-full"
            />
            {dateRange?.from && dateRange?.to && (
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setDateRange(undefined)}
                >
                    Filter entfernen
                </Button>
            )}
        </div>
    )
} 