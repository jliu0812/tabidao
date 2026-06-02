"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icons broken by webpack/Next.js bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Event = {
  id: string;
  description: string;
  timeStart: string | null;
  timeEnd: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
};

type Day = {
  id: string;
  dayNumber: number;
  events: Event[];
};

type Itinerary = {
  id: string;
  title: string;
  destination: string | null;
  days: Day[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ItineraryMapProps {
  itineraryId: string;
}

export function ItineraryMap({ itineraryId }: ItineraryMapProps) {
  const { data } = useSWR<Itinerary>(
    `/api/itinerary/${itineraryId}`,
    fetcher,
    { refreshInterval: 3000 }
  );

  const events = data?.days?.flatMap((d) => d.events) ?? [];
  const mappable = events.filter(
    (e): e is Event & { latitude: number; longitude: number } =>
      e.latitude !== null && e.longitude !== null
  );

  // Default center: if there are events with coords use the first one, else world center
  const defaultCenter: [number, number] =
    mappable.length > 0
      ? [mappable[0].latitude, mappable[0].longitude]
      : [20, 0];
  const defaultZoom = mappable.length > 0 ? 13 : 2;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="h-full w-full"
      key={`${defaultCenter[0]}-${defaultCenter[1]}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mappable.map((event) => (
        <Marker key={event.id} position={[event.latitude, event.longitude]}>
          <Popup>
            <strong className="block">{event.description}</strong>
            {event.location && (
              <span className="text-gray-500 text-xs">{event.location}</span>
            )}
            {event.timeStart && (
              <span className="block text-xs mt-1">
                {event.timeStart}
                {event.timeEnd ? ` – ${event.timeEnd}` : ""}
              </span>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
