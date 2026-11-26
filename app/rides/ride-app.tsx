"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CarFront } from "lucide-react";
import { Chat } from "./chat";
import { emptyFilters, filterRides, initialFilters, rides } from "./demo";
import { RideDetails } from "./details";
import { RideMap } from "./map";
import { Navigation, sections, type Section } from "./navigation";
import { OfferRide } from "./offer";
import { RideCard, TripDetails } from "./ride-card";
import { RideSearch } from "./search";
import type { Driver, Message, Ride } from "./types";

const demoDriver: Driver = {
  id: "demo-driver", name: "Jamie A.", rating: 0, reviewCount: 0,
  bio: "Demo account used to try offering rides.", reviews: [],
};

const drivers = rides.map((ride) => ride.driver);

export function RideApp() {
  const [section, setSection] = useState<Section>("find");
  const [draft, setDraft] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedRide, setSelectedRide] = useState<Ride>();
  const [previewRideId, setPreviewRideId] = useState<string>();
  const [requests, setRequests] = useState<Record<string, number>>({});
  const [offers, setOffers] = useState<Ride[]>([]);
  const [activeDriver, setActiveDriver] = useState<Driver>();
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [notice, setNotice] = useState("");

  const matches = useMemo(() => filterRides(rides, filters), [filters]);
  const previewRide = matches.find((ride) => ride.id === previewRideId);
  const title = sections.find(({ id }) => id === section)?.label;

  function navigate(next: Section) {
    setSection(next);
    setNotice("");
    window.scrollTo(0, 0);
  }

  function openChat(driver: Driver) {
    setSelectedRide(undefined);
    selectDriver(driver);
    navigate("messages");
    requestAnimationFrame(() => document.getElementById("screen-title")?.focus());
  }

  function selectDriver(driver: Driver) {
    setActiveDriver(driver);
    const greeting: Message = {
      id: `greeting-${driver.id}`, from: "driver", sentAt: Date.now(),
      text: `Hi, I’m ${driver.name} Ask me anything about the ride.`,
    };
    setConversations((current) => current[driver.id] ? current : { ...current, [driver.id]: [greeting] });
  }

  function sendMessage(driver: Driver, text: string) {
    const message: Message = { id: crypto.randomUUID(), from: "passenger", text, sentAt: Date.now() };
    setConversations((current) => ({ ...current, [driver.id]: [...(current[driver.id] ?? []), message] }));
  }

  function applyFilters(next: typeof filters) {
    setPreviewRideId(undefined);
    setDraft(next);
    setFilters(next);
  }

  function clearFilters() {
    applyFilters(emptyFilters);
  }

  function postOffer(ride: Ride) {
    setOffers((current) => [...current, ride]);
    navigate("trips");
    setNotice("Demo ride posted to My Trips.");
  }

  return (
    <div className="app-frame">
      <Navigation active={section} onNavigate={(next) => {
        if (next === "messages" && !activeDriver) selectDriver(drivers[0]);
        navigate(next);
      }} />
      <main className="min-w-0 flex-1">
        <div className="shell py-6 sm:py-9">
          <div role="status">{notice && <p className="mb-4 rounded-xl bg-tint px-4 py-3 text-muted">{notice}</p>}</div>

          {section !== "find" && (
            <h1 id="screen-title" tabIndex={-1} className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          )}

          {section === "find" && (
            <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-6">
              <div className="min-w-0 lg:col-start-1 lg:row-start-1">
                <div className="mb-5">
                  <h1 id="screen-title" tabIndex={-1} className="text-3xl font-bold tracking-tight sm:text-4xl">Find a ride</h1>
                  <p className="mt-2 text-sm text-muted">Search demo carpools from College Station.</p>
                </div>
                <RideSearch filters={draft} onChange={setDraft} onSearch={() => applyFilters(draft)} onClear={clearFilters} />
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by destination">
                  {["", ...new Set(rides.map((ride) => ride.destination))].map((destination) => (
                    <button key={destination} type="button" aria-pressed={filters.destination === destination}
                      className="cursor-pointer rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-muted hover:border-muted hover:text-muted aria-pressed:border-muted aria-pressed:bg-hover aria-pressed:text-white"
                      onClick={() => applyFilters({ ...filters, destination })}>
                      {destination || "All rides"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-0 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <RideMap rides={matches} selectedRide={previewRide} initialSearch={filters === initialFilters} onClearRoute={() => setPreviewRideId(undefined)} />
              </div>

              <section className="min-w-0 lg:col-start-1 lg:row-start-2" aria-labelledby="results-title">
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <h2 id="results-title" className="text-xl font-bold tracking-tight">Available rides</h2>
                  <span className="text-sm text-muted" role="status">{matches.length} {matches.length === 1 ? "ride" : "rides"}</span>
                </div>
                <div className="grid gap-3">
                  {matches.map((ride) => (
                    <RideCard key={ride.id} ride={ride} onView={() => {
                      setSelectedRide(ride);
                      setPreviewRideId(ride.id);
                    }} onMessage={openChat} previewed={previewRide?.id === ride.id} onPreview={() => {
                      setPreviewRideId(ride.id);
                      document.getElementById("ride-map-title")?.scrollIntoView({ block: "nearest" });
                    }} />
                  ))}
                  {!matches.length && (
                    <div className="panel p-5">
                      <p className="font-semibold">No matching rides</p>
                      <p className="mt-1 text-sm text-muted">Try a different destination, date, or passenger count.</p>
                      <button className="secondary mt-4" onClick={clearFilters}>Clear filters</button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {section === "offer" && (
            <>
              <p className="mb-4 text-muted">Try posting a fictional carpool. Use city names for pickup and destination.</p>
              <OfferRide driver={demoDriver} onOffer={postOffer} />
            </>
          )}

          {section === "trips" && (
            <div className="grid gap-4 md:grid-cols-2">
              <section className="panel p-5">
                <h2 className="mb-4 flex items-center gap-2 font-bold"><CalendarDays size={18} className="text-muted" aria-hidden="true" /> Ride requests</h2>
                {Object.keys(requests).length === 0 && <p className="text-muted">Your demo ride requests will appear here.</p>}
                {rides.filter((ride) => requests[ride.id]).map((ride) => (
                  <article key={ride.id} className="border-t border-line py-4">
                    <h3 className="mb-2 font-bold">{ride.driver.name}</h3>
                    <TripDetails ride={ride} />
                    <p className="mt-2 text-sm font-semibold text-muted">Demo request · {requests[ride.id]} {requests[ride.id] === 1 ? "passenger" : "passengers"}</p>
                    <button className="secondary mt-3" onClick={() => openChat(ride.driver)}>Message driver</button>
                  </article>
                ))}
              </section>
              <section className="panel p-5">
                <h2 className="mb-4 flex items-center gap-2 font-bold"><CarFront size={18} className="text-muted" aria-hidden="true" /> Your offers</h2>
                {offers.length === 0 && <p className="text-muted">Rides you offer in this demo will appear here.</p>}
                {offers.map((ride) => <article key={ride.id} className="border-t border-line py-4"><TripDetails ride={ride} /><p className="mt-2 text-sm font-semibold text-muted">${ride.expenseShare} estimated per passenger</p></article>)}
              </section>
            </div>
          )}

          {section === "messages" && <Chat drivers={drivers} active={activeDriver} conversations={conversations} onSelect={selectDriver} onSend={sendMessage} />}

          {section === "profile" && (
            <section className="panel max-w-xl p-5">
              <p className="text-sm font-semibold text-muted">Demo profile</p>
              <h2 className="mt-1 text-xl font-bold">{demoDriver.name}</h2>
              <p className="mt-2 text-muted">{demoDriver.bio}</p>
            </section>
          )}
        </div>
      </main>
      <footer className="border-t border-line bg-inset">
        <p className="shell py-5 text-center text-xs leading-relaxed text-muted">Educational demo with fictional users and trips.</p>
        <p className="shell pb-5 text-center text-xs text-muted">Excellence · Integrity · Leadership · Loyalty · Respect · Selfless Service</p>
      </footer>
      {selectedRide && (
        <RideDetails ride={selectedRide} passengers={requests[selectedRide.id] ?? filters.passengers} requested={Boolean(requests[selectedRide.id])}
          onClose={() => setSelectedRide(undefined)} onMessage={openChat}
          onRequest={() => {
            setRequests((current) => ({ ...current, [selectedRide.id]: filters.passengers }));
            setSelectedRide(undefined);
            navigate("trips");
            setNotice("Demo ride request added to My Trips.");
            requestAnimationFrame(() => document.getElementById("screen-title")?.focus());
          }} />
      )}
    </div>
  );
}
