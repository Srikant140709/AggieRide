"use client";

import { useState } from "react";
import {
  CarFront,
  MapPin,
  Navigation,
  Search,
  Star,
  Users,
  MessageCircle,
  Clock,
} from "lucide-react";

const rides = [
  {
    id: 1,
    driver: "Alex M.",
    destination: "Houston",
    price: 15,
    rating: 4.9,
    seats: 2,
    time: "3:00 PM",
    vehicle: "Toyota Camry",
  },
  {
    id: 2,
    driver: "Jordan R.",
    destination: "Dallas",
    price: 20,
    rating: 4.8,
    seats: 3,
    time: "5:30 PM",
    vehicle: "Honda Accord",
  },
  {
    id: 3,
    driver: "Taylor S.",
    destination: "Austin",
    price: 12,
    rating: 5.0,
    seats: 2,
    time: "2:00 PM",
    vehicle: "Toyota Corolla",
  },
];

export default function Home() {
  const [destination, setDestination] = useState("");

  const filteredRides = rides.filter((ride) =>
    ride.destination.toLowerCase().includes(destination.toLowerCase().trim())
  );

  return (
    <main className="min-h-screen bg-[#f6f5f3] text-[#111111]">
      {/* Top maroon bar */}
      <header className="bg-[#500000] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase">
              Home of the student ride
            </p>
          </div>

          <div className="hidden gap-8 text-sm md:flex">
            <span>How it Works</span>
            <span>Offer a Ride</span>
            <span>Find a Ride</span>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-white/30 px-4 py-2">
            <MessageCircle size={18} />
            <span className="text-sm">Messages</span>
          </div>
        </div>
      </header>

      {/* Main navigation */}
      <section className="border-b border-[#d8d3cd] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-wide text-[#500000] md:text-5xl">
              AggieRide
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Peer-to-peer student rideshare and carpool platform
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 text-base font-semibold text-[#111111]">
            <span>About</span>
            <span>Rides</span>
            <span>Messages</span>
            <span>Safety</span>
            <span>Profile</span>
          </nav>
        </div>
      </section>

     {/* Aggie core values */}
<section className="border-b border-neutral-300 bg-[#eaeaea]">
  <div className="mx-auto max-w-7xl px-6 py-4">
    <p className="text-center text-sm font-semibold leading-relaxed text-[#500000]">
      Excellence · Integrity · Leadership · Loyalty ·
      Respect · Selfless Service
    </p>
  </div>
</section>
      {/* Hero + search */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left side */}
          <div>
            <h3 className="text-4xl font-bold leading-tight md:text-5xl">
  Where are you headed?
</h3>

<p className="mt-4 text-lg text-neutral-600">
  Find a ride. Share the cost. Travel with fellow Aggies.
</p>

            {/* Search card */}
            <div className="mt-8 rounded-2xl border border-[#d8d3cd] bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickup"
                    className="text-sm font-medium text-neutral-600"
                  >
                    Pickup location
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#d8d3cd] bg-[#f6f5f3] p-4">
                    <MapPin size={20} className="text-[#500000]" />
                    <input
                      id="pickup"
                      value="College Station"
                      readOnly
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="destination"
                    className="text-sm font-medium text-neutral-600"
                  >
                    Destination
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#d8d3cd] bg-[#f6f5f3] p-4">
                    <Navigation size={20} className="text-[#500000]" />
                    <input
                      id="destination"
                      placeholder="Houston, Dallas, Austin..."
                      value={destination}
                      onChange={(event) => setDestination(event.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                    <Search size={18} className="text-neutral-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side info panel */}
          {/* Popular destinations */}
<div className="rounded-2xl border border-neutral-300 bg-white p-6">

  <h4 className="text-xl font-bold text-[#500000]">
    Popular destinations
  </h4>

  <p className="mt-2 text-sm text-neutral-500">
    Explore common routes from College Station.
  </p>

  <div className="mt-4 divide-y divide-neutral-200">

    {["Houston", "Austin", "Dallas", "San Antonio"].map((city) => (
      <button
        key={city}
        onClick={() => setDestination(city)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-4 text-left hover:bg-neutral-100"
      >
        <MapPin size={20} className="text-[#500000]" />

        <span className="font-medium">
          {city}
        </span>

        <Navigation
          size={16}
          className="ml-auto text-[#500000]"
        />
      </button>
        ))}
  </div>
</div>
</div>

{/* Ride cards */}
<section className="mt-12"></section>
        {/* Ride cards */}
        <section className="mt-12">
          <h4 className="text-2xl font-bold text-[#500000]">
            Available rides ({filteredRides.length})
          </h4>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRides.map((ride) => (
              <article
                key={ride.id}
                className="rounded-2xl border border-[#d8d3cd] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#f6f0f0] p-3 text-[#500000]">
                    <CarFront size={24} />
                  </div>

                  <div>
                    <h5 className="font-bold">{ride.driver}</h5>
                    <div className="mt-1 flex items-center gap-1 text-sm text-[#7a0019]">
                      <Star size={14} fill="currentColor" />
                      {ride.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-[#500000]">
                      ${ride.price}
                    </p>
                    <p className="text-xs text-neutral-500">per seat</p>
                  </div>
                </div>

                <hr className="my-5 border-[#e5e1db]" />

                <p className="font-semibold">
                  College Station → {ride.destination}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
                  <Clock size={16} />
                  Departure: {ride.time}
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
                  <Users size={16} />
                  {ride.seats} seats available
                </div>

                <p className="mt-2 text-sm text-neutral-600">{ride.vehicle}</p>

                <div className="mt-5 flex flex-col gap-2">
                  <button className="rounded-xl bg-[#500000] px-4 py-3 font-semibold text-white hover:bg-[#6a0000]">
                    View ride
                  </button>

                  <button className="rounded-xl border border-[#d8d3cd] px-4 py-3 font-semibold text-[#500000] hover:bg-[#f7f2f2]">
                    Message driver
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredRides.length === 0 && (
            <p className="mt-6 text-neutral-600">
              No matching rides found. Try another destination.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}