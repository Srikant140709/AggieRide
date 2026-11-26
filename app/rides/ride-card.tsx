import { CarFront, Clock3, MapPin, MessageCircle, Route, Star, Users } from "lucide-react";
import { formatDate, formatTime } from "./demo";
import type { Driver, Ride } from "./types";

export function DriverRating({ driver }: { driver: Driver }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-sm text-muted">
      <Star size={14} className="fill-maroon text-maroon" aria-hidden="true" />
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
    <article className={`panel p-4 sm:p-5 ${previewed ? "ring-2 ring-maroon" : ""}`}>
      <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
        <div className="rounded-xl bg-tint p-3 text-maroon"><CarFront size={21} aria-hidden="true" /></div>
        <div>
          <h3 className="font-bold">{ride.driver.name}</h3>
          <DriverRating driver={ride.driver} />
        </div>
        <div className="ml-auto shrink-0 text-right">
          <p className="text-xl font-bold text-maroon">${ride.expenseShare}</p>
          <p className="text-sm text-muted">est. per person</p>
        </div>
      </div>
      <TripDetails ride={ride} />
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="primary" onClick={onView}>View ride</button>
        <button className="secondary" aria-pressed={previewed} onClick={onPreview}><Route size={16} aria-hidden="true" /> Preview route</button>
        <button className="secondary" onClick={() => onMessage(ride.driver)}><MessageCircle size={16} aria-hidden="true" /> Message driver</button>
      </div>
    </article>
  );
}
