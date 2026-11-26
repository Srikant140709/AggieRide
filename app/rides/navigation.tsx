import { CalendarDays, CarFront, CircleUserRound, MessageCircle, Plus, Search } from "lucide-react";

export const sections = [
  { id: "find", label: "Find a Ride", icon: Search },
  { id: "offer", label: "Offer a Ride", icon: Plus },
  { id: "trips", label: "My Trips", icon: CalendarDays },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: CircleUserRound },
] as const;

export type Section = (typeof sections)[number]["id"];

export function Navigation({ active, onNavigate }: { active: Section; onNavigate: (section: Section) => void }) {
  return (
    <header className="border-b border-maroon bg-maroon text-white">
      <div className="shell flex min-h-14 items-center justify-between gap-4">
        <button className="inline-flex cursor-pointer items-center gap-2 focus-visible:outline-white text-lg font-bold tracking-tight text-white" onClick={() => onNavigate("find")}>
          <CarFront size={20} aria-hidden="true" />
          AggieRide
        </button>
        <nav aria-label="Main navigation" className="app-nav">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} aria-current={id === active ? "page" : undefined} onClick={() => onNavigate(id)}>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
