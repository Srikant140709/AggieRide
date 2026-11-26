import { CalendarDays, ChevronDown, Clock3, MapPin, Navigation, Search, Users } from "lucide-react";
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

  return (
    <form onSubmit={submit} className="panel space-y-4 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="field-label">Pickup location
          <span className="field"><MapPin aria-hidden="true" /><input value={filters.pickup} onChange={(event) => onChange({ ...filters, pickup: event.target.value })} placeholder="City or area" /></span>
        </label>
        <label className="field-label">Destination
          <span className="field"><Navigation aria-hidden="true" /><input value={filters.destination} onChange={(event) => onChange({ ...filters, destination: event.target.value })} placeholder="Where to?" /></span>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="field-label">Travel date
          <span className="field"><CalendarDays aria-hidden="true" /><input type="date" value={filters.date} onChange={(event) => onChange({ ...filters, date: event.target.value })} /></span>
        </label>
        <label className="field-label">Depart after
          <span className="field"><Clock3 aria-hidden="true" /><input type="time" value={filters.time} onChange={(event) => onChange({ ...filters, time: event.target.value })} /></span>
        </label>
        <label className="field-label">Passengers
          <span className="field"><Users aria-hidden="true" /><select value={filters.passengers} onChange={(event) => onChange({ ...filters, passengers: Number(event.target.value) })}>
            {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count}</option>)}
          </select><ChevronDown aria-hidden="true" /></span>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="primary"><Search size={17} aria-hidden="true" /> Search rides</button>
        <button className="secondary" type="button" onClick={onClear}>Clear filters</button>
      </div>
    </form>
  );
}
