import { useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { DriverRating, TripDetails } from "./ride-card";
import type { Driver, Ride } from "./types";

export function RideDetails({ ride, passengers, requested, onClose, onMessage, onRequest }: {
  ride: Ride;
  passengers: number;
  requested: boolean;
  onClose: () => void;
  onMessage: (driver: Driver) => void;
  onRequest: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog ref={dialog} onClose={onClose} aria-labelledby="driver-details-title" className="ride-dialog panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="driver-details-title" className="text-2xl font-bold">{ride.driver.name}</h2>
          <DriverRating driver={ride.driver} />
        </div>
        <button className="secondary !p-2" aria-label="Close ride details" onClick={onClose}><X size={20} aria-hidden="true" /></button>
      </div>
      <p className="mt-4 text-muted">{ride.driver.bio}</p>
      <section className="mt-5 rounded-xl bg-inset p-4">
        <h3 className="mb-3 font-bold">Trip details</h3>
        <TripDetails ride={ride} />
        <h4 className="mt-3 font-semibold">Expense-sharing estimate</h4>
        <p className="mt-1 font-bold text-muted">${ride.expenseShare} estimated per passenger · ${ride.expenseShare * passengers} estimated for {passengers} {passengers === 1 ? "passenger" : "passengers"}</p>
        <p className="mt-2 text-sm text-muted">Participants would arrange any reimbursement independently, outside AggieRide.</p>
      </section>
      <section className="mt-5">
        <h3 className="mb-2 font-bold">Written reviews</h3>
        {ride.driver.reviews.length ? ride.driver.reviews.map((review) => (
          <div key={review.author} className="border-b border-line py-3 text-sm">
            <p className="font-semibold">{review.author} · {review.rating}/5</p>
            <p className="mt-1 text-muted">{review.text}</p>
          </div>
        )) : <p className="text-muted">No written reviews yet.</p>}
      </section>
      <div className="mt-5 flex flex-wrap gap-2">
        <button className="primary" disabled={requested} onClick={onRequest}>{requested ? "Demo request saved" : "Request demo ride"}</button>
        <button className="secondary" onClick={() => onMessage(ride.driver)}><MessageCircle size={16} aria-hidden="true" /> Message driver</button>
      </div>
    </dialog>
  );
}
