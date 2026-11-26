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
    <header className="border-b border-line bg-white">
      <div className="shell flex min-h-16 items-center justify-between gap-4">
        <button className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-maroon" onClick={() => onNavigate("find")}>
          <span className="rounded-lg bg-maroon p-2 text-white"><CarFront size={21} aria-hidden="true" /></span>
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
