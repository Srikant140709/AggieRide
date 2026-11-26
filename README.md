# AggieRide

A website that shows how Texas A&M students could find and share carpools from College Station. Browse rides to Houston, Dallas, and Austin, compare your options, and try messaging a driver before requesting a seat.

Coordinating a carpool can take a lot of back-and-forth. When does the driver leave? Are there enough seats? What might each person chip in? AggieRide puts those details in one place. It's an independent, noncommercial educational project with fictional drivers and trips.

## What it does

- **Find a ride.** Search by pickup city, destination, travel date, departure time, or passenger count. The destination shortcuts filter the ride list and map together.
- **Compare rides.** Each card shows the departure time, open seats, vehicle, driver rating, and estimated expense share. Open a ride to read the driver's bio and sample reviews.
- **Explore the map.** Pan and zoom around matching routes, or select **Preview route** to see an approximate line between two city centers. Use **Measure distance** to choose any two points and see the straight-line distance in miles and kilometers.
- **Offer a ride or request a seat.** Try posting a fictional trip or requesting a seat, then see it under **My Trips**.
- **Message a driver.** Try a one-to-one conversation before requesting a ride. Messages, offers, and requests stay in the open page and reset when you reload.

## Built with

- Next.js, React, and TypeScript
- Tailwind CSS and Lucide React
- MapLibre GL JS with OpenFreeMap's Liberty basemap

## Run it yourself

1. Open the AggieRide project folder in a terminal.
2. Install the dependencies and start the development server:

   ```sh
   npm ci
   npm run dev -- --hostname 127.0.0.1
   ```

3. Open http://127.0.0.1:3000.

The browser fetches the basemap from OpenFreeMap. Searching and measuring distance run in the browser. AggieRide blocks access to GPS, the camera, and the microphone.

## Challenges along the way

- Getting MapLibre's tile worker and canvas to render reliably in Next.js.
- Keeping the ride list, map markers, and selected route in sync as filters change.
- Making map load failures recoverable so the ride list stays usable.

## What's next

- Make it easier to select an exact meeting point on the map.
- Consider typed place lookup and driving distances if a mapping service is approved.
- Explore saving offers, requests, and messages if a backend is approved.

Registration, live ride arrangements, and public deployment are outside the current demo. Expense shares are estimates. Participants would arrange any future reimbursements independently, and AggieRide never receives, holds, or transfers funds.

## Run checks

```sh
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

With permission to contact the npm registry, run `npm audit` to check for known dependency vulnerabilities.
