import type { Coordinates, DemoRide, Ride, RideFilters } from "./types";

export const emptyFilters: RideFilters = {
  pickup: "", destination: "", date: "", time: "", passengers: 1,
};

export const initialFilters = { ...emptyFilters, pickup: "College Station" };

export const collegeStation: Coordinates = [-96.3344, 30.6280];

export const rides: DemoRide[] = [
  {
    id: "houston", pickup: "College Station", destination: "Houston",
    pickupCoordinates: collegeStation, destinationCoordinates: [-95.3698, 29.7604],
    date: "2026-12-04", time: "15:00", seats: 2, expenseShare: 15, vehicle: "Toyota Camry",
    driver: {
      id: "alex", name: "Alex M.", rating: 4.9, reviewCount: 24,
      bio: "I head to Houston on weekends and usually have a couple of extra seats. Happy to make room for a small bag.",
      reviews: [
        { author: "Sam P.", rating: 5, text: "Alex arrived early and made the pickup easy to find." },
        { author: "Casey L.", rating: 5, text: "Smooth trip and plenty of room for my backpack." },
      ],
    },
  },
  {
    id: "dallas", pickup: "College Station", destination: "Dallas",
    pickupCoordinates: collegeStation, destinationCoordinates: [-96.7970, 32.7767],
    date: "2026-12-04", time: "17:30", seats: 3, expenseShare: 20, vehicle: "Honda Accord",
    driver: {
      id: "jordan", name: "Jordan R.", rating: 4.8, reviewCount: 18,
      bio: "I make the Dallas drive most Fridays. I like to plan a short rest stop on longer trips.",
      reviews: [{ author: "Morgan F.", rating: 5, text: "Jordan shared the timing ahead of the trip and left right on schedule." }],
    },
  },
  {
    id: "austin", pickup: "College Station", destination: "Austin",
    pickupCoordinates: collegeStation, destinationCoordinates: [-97.7431, 30.2672],
    date: "2026-12-05", time: "14:00", seats: 2, expenseShare: 12, vehicle: "Toyota Corolla",
    driver: {
      id: "taylor", name: "Taylor S.", rating: 5, reviewCount: 12,
      bio: "I carpool to Austin when I visit friends. There’s room for a backpack or a small overnight bag.",
      reviews: [{ author: "Drew K.", rating: 5, text: "Friendly driver and a comfortable ride to Austin." }],
    },
  },
];

export function filterRides<T extends Ride>(list: T[], filters: RideFilters) {
  const pickup = filters.pickup.trim().toLowerCase();
  const destination = filters.destination.trim().toLowerCase();

  return list.filter((ride) =>
    ride.pickup.toLowerCase().includes(pickup) &&
    ride.destination.toLowerCase().includes(destination) &&
    (!filters.date || ride.date === filters.date) &&
    (!filters.time || ride.time >= filters.time) &&
    ride.seats >= filters.passengers
  );
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function formatTime(time: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "UTC",
  }).format(new Date(`2000-01-01T${time}:00Z`));
}
