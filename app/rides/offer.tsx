import type { FormEvent } from "react";
import type { Driver, Ride } from "./types";

export function OfferRide({ driver, onOffer }: { driver: Driver; onOffer: (ride: Ride) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const pickup = String(fields.get("pickup")).trim();
    const destination = String(fields.get("destination")).trim();
    const vehicle = String(fields.get("vehicle")).trim();
    if (!pickup || !destination || !vehicle) return;

    onOffer({
      id: crypto.randomUUID(), driver, pickup, destination, vehicle,
      date: String(fields.get("date")), time: String(fields.get("time")),
      seats: Number(fields.get("seats")), expenseShare: Number(fields.get("expenseShare")),
    });
  }

  return (
    <form className="panel grid max-w-2xl gap-4 p-5 sm:grid-cols-2" onSubmit={submit}>
      <label className="field-label">Pickup city<span className="field"><input name="pickup" defaultValue="College Station" required maxLength={60} pattern={String.raw`.*\S.*`} /></span></label>
      <label className="field-label">Destination city<span className="field"><input name="destination" required maxLength={60} pattern={String.raw`.*\S.*`} /></span></label>
      <label className="field-label">Travel date<span className="field"><input name="date" type="date" required /></span></label>
      <label className="field-label">Departure time<span className="field"><input name="time" type="time" required /></span></label>
      <label className="field-label">Available seats<span className="field"><input name="seats" type="number" min="1" max="6" step="1" required /></span></label>
      <label className="field-label">Estimated share per passenger ($)<span className="field"><input name="expenseShare" type="number" min="0" max="999" step="1" required /></span></label>
      <label className="field-label sm:col-span-2">Vehicle<span className="field"><input name="vehicle" placeholder="Make and model" required maxLength={60} pattern={String.raw`.*\S.*`} /></span></label>
      <div className="sm:col-span-2"><button className="primary">Post demo ride</button></div>
    </form>
  );
}
