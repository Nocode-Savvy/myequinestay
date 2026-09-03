"use client";

/**
 * google-map.tsx
 *
 * Shared Google Maps wrapper for My Equine Stay.
 *
 * Two usage modes:
 *  1. Browse / search page — renders multiple listing price-pill markers.
 *  2. Listing wizard Step 3 — renders a single draggable marker; fires
 *     onMarkerDragEnd when the user repositions it.
 *
 * Error contract:
 *  - If NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is absent  → show fallback immediately.
 *  - If the Google Maps script fails to load         → onError fires → show fallback.
 *  - The fallback is a styled "Map unavailable" card. No raw JS errors are surfaced.
 */

import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapPin, AlertTriangle } from "lucide-react";
import type { ListingWithPhotos } from "@/types/database";

/* ─────────────────────────────────────────────────────────────
   Internal sub-components
   ───────────────────────────────────────────────────────────── */

/** Loading skeleton — matches the site's beige palette */
function MapSkeleton() {
  return (
    <div className="absolute inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center gap-3">
      <div className="size-12 rounded-full bg-[#1F3A2B]/10 grid place-items-center animate-pulse">
        <MapPin size={22} className="text-[#1F3A2B]" />
      </div>
      <p className="text-xs text-[#6E7771]">Loading map…</p>
    </div>
  );
}

/** "Map unavailable" fallback — shown on missing or invalid API key */
function MapUnavailable({ message }: { message?: string }) {
  return (
    <div
      data-testid="map-unavailable"
      className="absolute inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center gap-3 p-6 text-center"
    >
      <div className="size-12 rounded-full bg-amber-50 border border-amber-200 grid place-items-center">
        <AlertTriangle size={22} className="text-amber-500" />
      </div>
      <div>
        <p className="font-medium text-sm text-[#1B221E]">Map unavailable</p>
        <p className="text-xs text-[#6E7771] mt-1 max-w-xs">
          {message ??
            "The map could not be loaded. Please check your Google Maps API key configuration."}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Browse map — multiple listing price-pill markers
   ───────────────────────────────────────────────────────────── */

interface BrowseMarkersProps {
  listings: ListingWithPhotos[];
}

function BrowseMarkers({ listings }: BrowseMarkersProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const map = useMap();

  return (
    <>
      {listings.map((listing) => {
        if (!listing.latitude || !listing.longitude) return null;
        return (
          <AdvancedMarker
            key={listing.id}
            position={{ lat: listing.latitude, lng: listing.longitude }}
          >
            <div className="px-2.5 py-1 bg-[#1F3A2B] text-white rounded-full text-xs font-semibold shadow-md cursor-pointer hover:scale-110 transition-transform select-none">
              ${listing.price_per_night}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Wizard map — single draggable marker
   ───────────────────────────────────────────────────────────── */

interface WizardMarkerProps {
  position: google.maps.LatLngLiteral;
  onDragEnd: (lat: number, lng: number) => void;
}

function WizardMarker({ position, onDragEnd }: WizardMarkerProps) {
  const handleDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onDragEnd(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onDragEnd]
  );

  return (
    <AdvancedMarker
      position={position}
      draggable
      onDragEnd={handleDragEnd}
      title="Drag to adjust your property location"
    >
      <div className="flex flex-col items-center gap-0">
        <div className="size-9 rounded-full bg-[#1F3A2B] border-2 border-white shadow-lg grid place-items-center">
          <MapPin size={16} className="text-white" />
        </div>
        <div className="w-0.5 h-3 bg-[#1F3A2B]" />
      </div>
    </AdvancedMarker>
  );
}

/* ─────────────────────────────────────────────────────────────
   Public props
   ───────────────────────────────────────────────────────────── */

interface BrowseMapProps {
  mode: "browse";
  listings: ListingWithPhotos[];
  className?: string;
}

interface WizardMapProps {
  mode: "wizard";
  latitude: number;
  longitude: number;
  onMarkerDragEnd: (lat: number, lng: number) => void;
  className?: string;
}

type GoogleMapProps = BrowseMapProps | WizardMapProps;

/* ─────────────────────────────────────────────────────────────
   Main export
   ───────────────────────────────────────────────────────────── */

export function GoogleMapWrapper(props: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const [loadError, setLoadError] = useState(false);

  // Immediately show fallback if key is missing
  if (!apiKey) {
    return (
      <div className={`relative ${props.className ?? ""}`} data-testid="google-map-container">
        <MapUnavailable message="Google Maps API key is not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables." />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`relative ${props.className ?? ""}`} data-testid="google-map-container">
        <MapUnavailable message="Google Maps failed to load. Please verify your API key is valid and the Maps JavaScript API is enabled." />
      </div>
    );
  }

  /* Shared map settings */
  const defaultCenter =
    props.mode === "browse"
      ? { lat: 29.19, lng: -82.14 }
      : { lat: props.latitude, lng: props.longitude };

  const defaultZoom = props.mode === "browse" ? 10 : 13;

  return (
    <div
      className={`relative ${props.className ?? ""}`}
      data-testid="google-map-container"
    >
      <APIProvider
        apiKey={apiKey}
        onError={() => setLoadError(true)}
      >
        <Map
          mapId="mes-map"
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapTypeId="terrain"
          style={{ width: "100%", height: "100%" }}
        >
          {props.mode === "browse" && (
            <BrowseMarkers listings={props.listings} />
          )}

          {props.mode === "wizard" && (
            <WizardMarker
              position={{ lat: props.latitude, lng: props.longitude }}
              onDragEnd={props.onMarkerDragEnd}
            />
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
