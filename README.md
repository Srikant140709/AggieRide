# AggieRide

AggieRide is an independent, noncommercial educational project that demonstrates how students could discover and match with carpools.

## What the demo covers

- Search fictional rides by pickup, destination, date, departure time, and available seats.
- Explore fictional driver profiles, ratings, and written reviews.
- Compare estimated shares of trip expenses.
- Try one-to-one messaging, ride requests, and ride offers in the local demo. These interactions reset on reload. Chat messages stay in the current browser session.
- Pan and zoom the interactive map, see the public city centers for matching rides, and preview an approximate straight-line route. The basemap loads from OpenFreeMap. Ride searches use local demo data and the app never requests GPS access.

## Project scope

Expense estimates are for planning only. If a future live version is explicitly authorized, participants must arrange any reimbursements independently and outside AggieRide. AggieRide must never receive, hold, or transfer funds. Payment processors, checkout, payouts, commissions, subscriptions, and advertising are outside the project scope.

The application remains a fictional demonstration. Real-user registration, live ride arrangements, and public operational deployment require explicit authorization.

## Run locally

AggieRide uses Next.js, React, TypeScript, Tailwind CSS, Lucide React, and MapLibre GL JS.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 to explore the demo.

## Run checks

```sh
npm run lint
npm run build
npx tsc --noEmit --incremental false
```
