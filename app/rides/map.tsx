import { useEffect, useRef, useState } from "react";
import { Route } from "lucide-react";
import type { GeoJSONSource, Map as MapLibreMap, Marker } from "maplibre-gl";
import type { DemoRide } from "./types";
import { collegeStation } from "./demo";
import "maplibre-gl/dist/maplibre-gl.css";

const styleUrl = "https://tiles.openfreemap.org/styles/liberty";
const routeSource = "aggieride-route";
const overviewZoom = 5.6;
type MapStatus = "loading" | "ready" | "load-failed" | "unavailable" | "context-lost";

const statusText = {
  loading: "Loading map…",
  ready: "",
  "load-failed": "The basemap could not finish loading. Retry the map or continue browsing rides.",
  unavailable: "The map could not start. Check that WebGL is available, then retry.",
  "context-lost": "The map lost its graphics connection. Try reloading the map.",
};

export function RideMap({ rides, selectedRide, initialSearch, onClearRoute }: {
  rides: DemoRide[];
  selectedRide: DemoRide | undefined;
  initialSearch: boolean;
  onClearRoute: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const [mapSession, setMapSession] = useState<{
    map: MapLibreMap;
    library: typeof import("maplibre-gl");
  }>();

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const mapElement = element;

    let disposed = false;
    let map: MapLibreMap | undefined;
    let observer: ResizeObserver | undefined;
    let loadTimer: number | undefined;
    let styleReady = false;
    let contextLost = false;
    let workerUrl: string | undefined;
    let version: string | undefined;

    function logFailure(stage: string, error?: unknown, recoverable = false) {
      if (process.env.NODE_ENV !== "development") return;
      const details = {
        error, version, styleUrl, workerUrl, styleReady,
        width: mapElement.clientWidth, height: mapElement.clientHeight,
        sources: map?.getStyle()?.sources,
      };
      if (recoverable) console.warn(`[AggieRide map] ${stage}`, details);
      else console.error(`[AggieRide map] ${stage}`, details);
    }

    function watchForLoad() {
      window.clearTimeout(loadTimer);
      loadTimer = window.setTimeout(() => {
        logFailure("Timed out waiting for the basemap");
        setStatus("load-failed");
      }, 15000);
    }

    async function start() {
      try {
        const library = await import("maplibre-gl");
        if (disposed) return;
        // Give Turbopack the exact worker asset so it cannot resolve the main library as the worker.
        workerUrl = new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href;
        version = library.getVersion();
        library.setWorkerUrl(workerUrl);

        const instance = new library.Map({
          container: mapElement,
          style: styleUrl,
          center: collegeStation,
          zoom: overviewZoom,
          minZoom: 3,
          cooperativeGestures: true,
          dragRotate: false,
          touchPitch: false,
          pitchWithRotate: false,
          attributionControl: { compact: false },
        });
        map = instance;
        instance.addControl(new library.NavigationControl({ showCompass: false }), "top-right");
        observer = new ResizeObserver(() => instance.resize());
        observer.observe(mapElement);

        watchForLoad();
        instance.on("error", ({ error }) => {
          logFailure(styleReady ? "Map resource error" : "Error while loading the style", error, styleReady);
          if (!styleReady && !contextLost) setStatus("load-failed");
        });
        instance.on("webglcontextlost", () => {
          contextLost = true;
          styleReady = false;
          window.clearTimeout(loadTimer);
          logFailure("WebGL context lost");
          setStatus("context-lost");
        });
        instance.on("webglcontextrestored", () => {
          contextLost = false;
          setStatus("loading");
          watchForLoad();
          // MapLibre rebuilds the style after restoring the graphics context.
          instance.once("idle", markReady);
        });
        instance.on("style.load", () => {
          styleReady = true;
          if (instance.getSource(routeSource)) return;

          instance.addSource(routeSource, {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          instance.addLayer({
            id: routeSource,
            type: "line",
            source: routeSource,
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#500000", "line-width": 4, "line-dasharray": [2, 2] },
          });
          setMapSession({ map: instance, library });
        });

        function markReady() {
          if (contextLost || !styleReady) return;
          window.clearTimeout(loadTimer);
          setStatus("ready");
        }

        instance.once("load", markReady);
      } catch (error) {
        logFailure("Could not initialize MapLibre or WebGL", error);
        window.clearTimeout(loadTimer);
        observer?.disconnect();
        map?.remove();
        map = undefined;
        if (!disposed) setStatus("unavailable");
      }
    }

    void start();

    return () => {
      disposed = true;
      window.clearTimeout(loadTimer);
      observer?.disconnect();
      map?.remove();
      // A failed WebGL constructor can leave elements in the container.
      element.replaceChildren();
    };
  }, [attempt]);

  useEffect(() => {
    if (!mapSession) return;
    const { map, library } = mapSession;
    const pickupLocations = new Map(rides.map((ride) => [ride.pickup, ride.pickupCoordinates]));
    const destinations = new Map(rides.map((ride) => [ride.destination, ride.destinationCoordinates]));
    const markers: Marker[] = [];

    for (const [role, locations] of [["Pickup", pickupLocations], ["Destination", destinations]] as const) {
      const selectedCity = role === "Pickup" ? selectedRide?.pickup : selectedRide?.destination;
      for (const [city, coordinates] of locations) {
        const label = document.createElement("span");
        label.className = "ride-map-marker";
        label.dataset.role = role;
        label.dataset.selected = String(city === selectedCity);
        label.textContent = city;
        label.title = `${role}: ${city}`;
        label.setAttribute("aria-label", label.title);
        markers.push(new library.Marker({ element: label }).setLngLat(coordinates).addTo(map));
      }
    }

    const route = selectedRide
      ? [selectedRide.pickupCoordinates, selectedRide.destinationCoordinates]
      : [];
    map.getSource<GeoJSONSource>(routeSource)?.setData({
      type: "FeatureCollection",
      features: selectedRide
        ? [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route } }]
        : [],
    });

    const points = selectedRide ? route : [...pickupLocations.values(), ...destinations.values()];
    if ((initialSearch && !selectedRide) || points.length === 0) {
      map.jumpTo({ center: collegeStation, zoom: overviewZoom });
    } else {
      const bounds = new library.LngLatBounds();
      for (const point of points) bounds.extend(point);
      map.fitBounds(bounds, { padding: { top: 56, right: 76, bottom: 56, left: 76 }, maxZoom: 10, duration: 0 });
    }

    return () => {
      for (const marker of markers) marker.remove();
    };
  }, [mapSession, rides, selectedRide, initialSearch]);

  return (
    <aside className="panel overflow-hidden" aria-labelledby="ride-map-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 id="ride-map-title" className="flex items-center gap-2 font-bold">
          <Route size={18} className="text-maroon" aria-hidden="true" /> Ride map
        </h2>
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-maroon" /> Pickup</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full border border-maroon bg-white" /> Destination</span>
        </div>
      </div>
      <div className="ride-map">
        {/* Match the panel height even when MapLibre applies its own container positioning. */}
        <div ref={container} style={{ width: "100%", height: "100%" }} />
        {status !== "ready" && (
          <div className="absolute inset-x-3 bottom-10 z-10 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-white p-3 shadow-sm">
            <p className="text-sm text-muted" role="status">{statusText[status]}</p>
            {status !== "loading" && (
              <button className="secondary" onClick={() => {
                setMapSession(undefined);
                setStatus("loading");
                setAttempt((current) => current + 1);
              }}>Retry map</button>
            )}
          </div>
        )}
      </div>
      {selectedRide && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-tint px-5 py-3">
          <div role="status">
            <p className="font-semibold text-maroon">Approximate route preview</p>
            <p className="text-sm text-muted">{selectedRide.pickup} → {selectedRide.destination} · Straight line between city centers</p>
          </div>
          <button className="secondary" onClick={onClearRoute}>Clear route</button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        {rides.length ? (
          <>
            <span className="text-sm font-semibold">Matching destinations</span>
            {[...new Set(rides.map((ride) => ride.destination))].map((city) => (
              <span key={city} className="rounded-full bg-offwhite px-3 py-1 text-sm text-muted">{city}</span>
            ))}
          </>
        ) : <span className="text-sm text-muted">No matching destinations</span>}
      </div>
    </aside>
  );
}
