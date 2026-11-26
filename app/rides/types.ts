export type RideFilters = {
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
};

export type Driver = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  bio: string;
  reviews: { author: string; rating: number; text: string }[];
};

export type Ride = {
  id: string;
  driver: Driver;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  expenseShare: number;
  vehicle: string;
};

export type Message = {
  id: string;
  from: "driver" | "passenger";
  text: string;
  sentAt: number;
};

export type Coordinates = [longitude: number, latitude: number];

export type DemoRide = Ride & {
  pickupCoordinates: Coordinates;
  destinationCoordinates: Coordinates;
};
