import { CarFront, Clock3, MapPin, MessageCircle, Route, Star, Users } from "lucide-react";
import { formatDate, formatTime } from "./demo";
import type { Driver, Ride } from "./types";

export function DriverRating({ driver }: { driver: Driver }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-sm text-muted">
      <Star size={14} className="fill-muted text-muted" aria-hidden="true" />
      <strong className="text-ink">{driver.rating.toFixed(1)}</strong> ({driver.reviewCount} reviews)
    </span>
  );
}

export function TripDetails({ ride }: { ride: Ride }) {
  return (
    <div className="space-y-2 text-sm text-muted">
      <p className="flex items-center gap-2 font-semibold text-ink"><MapPin size={16} aria-hidden="true" /> {ride.pickup} → {ride.destination}</p>
      <p className="flex items-center gap-2"><Clock3 size={16} aria-hidden="true" /> {formatDate(ride.date)} · {formatTime(ride.time)}</p>
      <p className="flex items-center gap-2"><CarFront size={16} aria-hidden="true" /> {ride.vehicle}</p>
      <p className="flex items-center gap-2"><Users size={16} aria-hidden="true" /> {ride.seats} {ride.seats === 1 ? "seat" : "seats"} available</p>
    </div>
  );
}

export function RideCard({ ride, onView, onMessage, previewed, onPreview }: {
  ride: Ride;
  onView: () => void;
  previewed: boolean;
  onPreview: () => void;
  onMessage: (driver: Driver) => void;
}) {
  return (
    <article className={`panel p-4 ${previewed ? "border-muted ring-1 ring-muted" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-tight">To {ride.destination}</h3>
          <p className="mt-0.5 text-sm text-muted">From {ride.pickup}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold tabular-nums text-ink">${ride.expenseShare}</p>
          <p className="text-xs text-muted">est. per person</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5"><Clock3 size={15} aria-hidden="true" /> {formatDate(ride.date)} · {formatTime(ride.time)}</span>
        <span className="inline-flex items-center gap-1.5"><Users size={15} aria-hidden="true" /> {ride.seats} {ride.seats === 1 ? "seat" : "seats"}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <div>
          <p className="text-sm font-semibold">{ride.driver.name} <span className="font-normal text-muted">· {ride.vehicle}</span></p>
          <DriverRating driver={ride.driver} />
        </div>
        <button className="primary" onClick={onView}>View ride</button>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <button className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-sm font-medium text-muted hover:underline aria-pressed:underline" aria-pressed={previewed} onClick={onPreview}>
          <Route size={16} aria-hidden="true" /> Preview route
        </button>
        <button className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-sm font-medium text-muted hover:underline" onClick={() => onMessage(ride.driver)}>
          <MessageCircle size={16} aria-hidden="true" /> Message driver
        </button>
      </div>
    </article>
  );
}
