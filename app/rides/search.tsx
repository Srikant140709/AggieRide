import { CalendarDays, ChevronDown, Clock3, MapPin, Search, Users } from "lucide-react";
import type { FormEvent } from "react";
import type { RideFilters } from "./types";

export function RideSearch({ filters, onChange, onSearch, onClear }: {
  filters: RideFilters;
  onChange: (filters: RideFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  const field = "mt-1.5 flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-[#c6a7ae] bg-[#faf5f6] px-3 focus-within:border-maroon";
  const input = "min-w-0 flex-1 bg-transparent py-2 text-base focus-visible:outline-maroon font-medium placeholder:text-[#68434b]";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-[#d9bdc4] p-4 shadow-lg shadow-black/15 sm:p-5" style={{ backgroundColor: "#fff", color: "#500000", colorScheme: "light" }}>
      <div className="grid gap-3">
        <label className="field-label">Pickup location
          <span className={field}><MapPin size={16} className="shrink-0" aria-hidden="true" /><input className={input} value={filters.pickup} onChange={(event) => onChange({ ...filters, pickup: event.target.value })} placeholder="City or area" /></span>
        </label>
        <label className="field-label">Destination
          <span className={field}><MapPin size={16} className="shrink-0" aria-hidden="true" /><input className={input} value={filters.destination} onChange={(event) => onChange({ ...filters, destination: event.target.value })} placeholder="Where to?" /></span>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="field-label">Travel date
          <span className={field}><CalendarDays size={16} className="hidden shrink-0 sm:block" aria-hidden="true" /><input className={input} type="date" value={filters.date} onChange={(event) => onChange({ ...filters, date: event.target.value })} /></span>
        </label>
        <label className="field-label">Depart after
          <span className={field}><Clock3 size={16} className="hidden shrink-0 sm:block" aria-hidden="true" /><input className={input} type="time" value={filters.time} onChange={(event) => onChange({ ...filters, time: event.target.value })} /></span>
        </label>
        <label className="field-label col-span-2">Passengers
          <span className={field}><Users size={16} className="shrink-0" aria-hidden="true" /><select className={input + " appearance-none"} value={filters.passengers} onChange={(event) => onChange({ ...filters, passengers: Number(event.target.value) })}>
            {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count}</option>)}
          </select><ChevronDown size={16} className="pointer-events-none shrink-0" aria-hidden="true" /></span>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="inline-flex min-h-12 grow cursor-pointer items-center justify-center gap-2 rounded-lg bg-maroon px-4 py-2 font-bold text-white hover:bg-[#701b29] focus-visible:outline-maroon"><Search size={18} aria-hidden="true" /> Find rides</button>
        <button className="inline-flex min-h-12 cursor-pointer items-center rounded-lg px-3 text-sm font-semibold text-maroon hover:bg-[#faf5f6] focus-visible:outline-maroon" type="button" onClick={onClear}>Clear filters</button>
      </div>
    </form>
  );
}
