"use client";

/**
 * google-map.tsx
 *
 * Shared Map component for My Equine Stay.
 *
 * Three usage modes:
 *  1. "browse"   — renders listing price-pill markers across the area; clicking a marker
 *                  opens a rich preview card with photos, pricing, and direct link.
 *  2. "property" — renders property location centered with an approximate privacy radius
 *                  zone (protects owner address while displaying real roads/surroundings).
 *  3. "wizard"   — renders a single draggable marker for listing wizard Step 3.
 *
 * Resilient Architecture:
 *  - If NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is present & valid → renders Google Maps with terrain/roadmap.
 *  - If API key is missing or fails to load → seamlessly renders an interactive OpenStreetMap /
 *    Leaflet map with the exact same price-pill markers, preview cards, and privacy radius circle.
 *  - NEVER leaves a blank or broken placeholder!
 */

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Component,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapPin, X, ArrowRight, Bed, Warehouse, ExternalLink } from "lucide-react";
import type { ListingWithPhotos } from "@/types/database";

/* ─────────────────────────────────────────────────────────────
   Map Error Boundary — catches unmount/render errors gracefully
   ───────────────────────────────────────────────────────────── */

interface MapErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

interface MapErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  constructor(props: MapErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Map component error caught by MapErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className={`relative ${this.props.className ?? ""}`}
          data-testid="google-map-container"
        >
          <div className="absolute inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm font-medium text-[#1B221E]">Map view</p>
            <p className="text-xs text-[#6E7771] mt-1">
              Unable to render interactive map. Please refresh or try again.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─────────────────────────────────────────────────────────────
   Public Props Interface
   ───────────────────────────────────────────────────────────── */

interface BrowseMapProps {
  mode: "browse";
  listings: ListingWithPhotos[];
  selectedListingId?: string | null;
  onSelectListing?: (id: string | null) => void;
  className?: string;
}

interface PropertyMapProps {
  mode: "property";
  latitude?: number | null;
  longitude?: number | null;
  city?: string;
  title?: string;
  className?: string;
}

interface WizardMapProps {
  mode: "wizard";
  latitude: number;
  longitude: number;
  onMarkerDragEnd: (lat: number, lng: number) => void;
  className?: string;
}

export type GoogleMapProps = BrowseMapProps | PropertyMapProps | WizardMapProps;

/* ─────────────────────────────────────────────────────────────
   Floating Listing Preview Card (used by both Google Maps & Leaflet)
   ───────────────────────────────────────────────────────────── */

interface ListingPreviewCardProps {
  listing: ListingWithPhotos;
  onClose: () => void;
}

function ListingPreviewCard({ listing, onClose }: ListingPreviewCardProps) {
  const coverPhoto =
    listing.listing_photos?.find((p) => p.is_cover)?.url ??
    listing.listing_photos?.[0]?.url;

  return (
    <div
      className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[1000] bg-white rounded-2xl shadow-2xl border border-[#E5E0D6] p-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex gap-3 items-start">
        {/* Thumbnail photo */}
        <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E5E0D6]/60">
          {coverPhoto ? (
            <Image
              src={coverPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="100px"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-[10px] text-[#6E7771]">
              No photo
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="absolute top-0 right-0 size-6 rounded-full bg-[#FAF7F2] hover:bg-[#E5E0D6] text-[#6E7771] grid place-items-center transition-colors"
          >
            <X size={14} />
          </button>

          <h4 className="font-serif text-sm font-semibold text-[#1B221E] truncate leading-snug">
            {listing.title}
          </h4>

          <p className="text-[11px] text-[#6E7771] mt-0.5 truncate">
            {listing.city}, FL
          </p>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6E7771]">
            <span className="inline-flex items-center gap-0.5">
              <Warehouse size={11} className="text-[#1F3A2B]" />
              {listing.stalls} stalls
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-0.5">
              <Bed size={11} className="text-[#1F3A2B]" />
              {listing.bedrooms ?? 1} bd
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="font-serif font-bold text-sm text-[#1F3A2B]">
              ${listing.price_per_night || 0}
            </span>
            <span className="text-[10px] text-[#6E7771]">/ night</span>
          </div>
        </div>
      </div>

      <Link
        href={`/property/${listing.id}`}
        className="mt-2.5 w-full py-1.5 px-3 rounded-full bg-[#1F3A2B] text-white text-xs font-medium hover:bg-[#1F3A2B]/90 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
      >
        <span>View Stay</span>
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Google Maps Sub-Components
   ───────────────────────────────────────────────────────────── */

/** Google Maps: Browse Markers */
function GoogleBrowseMarkers({
  listings,
  selectedId,
  onSelect,
}: {
  listings: ListingWithPhotos[];
  selectedId: string | null;
  onSelect: (listing: ListingWithPhotos) => void;
}) {
  return (
    <>
      {listings.map((listing) => {
        const lat = Number(listing.latitude);
        const lng = Number(listing.longitude);
        if (!isFinite(lat) || !isFinite(lng) || lat === 0 || lng === 0) return null;

        const isSelected = selectedId === listing.id;

        return (
          <AdvancedMarker
            key={listing.id}
            position={{ lat, lng }}
            onClick={() => onSelect(listing)}
          >
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-md cursor-pointer select-none transition-all duration-150 ${
                isSelected
                  ? "bg-[#E1B534] text-white ring-2 ring-white scale-110 z-20 shadow-lg"
                  : "bg-[#1F3A2B] text-white hover:scale-105 hover:bg-[#1F3A2B]/90"
              }`}
            >
              ${listing.price_per_night}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

/** Google Maps: Property Privacy Zone Overlay */
function GooglePropertyZoneOverlay({
  lat,
  lng,
  city,
}: {
  lat: number;
  lng: number;
  city?: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Draw circular privacy zone (~2km / 1.25 miles radius)
    const circle = new google.maps.Circle({
      map,
      center: { lat, lng },
      radius: 2000,
      strokeColor: "#E1B534",
      strokeOpacity: 0.85,
      strokeWeight: 2,
      fillColor: "#E1B534",
      fillOpacity: 0.16,
    });

    return () => {
      circle.setMap(null);
    };
  }, [map, lat, lng]);

  return (
    <AdvancedMarker position={{ lat, lng }}>
      <div className="flex flex-col items-center select-none pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-[#E1B534]/25 flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 rounded-full bg-[#E1B534] text-white flex items-center justify-center shadow-md">
            <MapPin size={14} />
          </div>
        </div>
        <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1F3A2B] bg-white/95 px-2.5 py-0.5 rounded-full shadow-md border border-[#E5E0D6]">
          Approximate area · {city || "Ocala"}, FL
        </span>
      </div>
    </AdvancedMarker>
  );
}

/** Google Maps: Wizard Draggable Marker */
function GoogleWizardMarker({
  position,
  onDragEnd,
}: {
  position: google.maps.LatLngLiteral;
  onDragEnd: (lat: number, lng: number) => void;
}) {
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
      <div className="flex flex-col items-center">
        <div className="size-9 rounded-full bg-[#1F3A2B] border-2 border-white shadow-lg grid place-items-center">
          <MapPin size={16} className="text-white" />
        </div>
        <div className="w-0.5 h-3 bg-[#1F3A2B]" />
      </div>
    </AdvancedMarker>
  );
}

/* ─────────────────────────────────────────────────────────────
   Leaflet / OpenStreetMap Implementation (Fallback & Zero-Key Mode)
   ───────────────────────────────────────────────────────────── */

function LeafletMapView(props: GoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [activeListing, setActiveListing] = useState<ListingWithPhotos | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    props.mode === "browse" ? props.selectedListingId ?? null : null
  );

  useEffect(() => {
    if (props.mode === "browse" && props.selectedListingId !== undefined) {
      setSelectedId(props.selectedListingId);
      if (props.selectedListingId) {
        const found = props.listings.find((l) => l.id === props.selectedListingId);
        if (found) setActiveListing(found);
      }
    }
  }, [props]);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    let isMounted = true;

    // 1. Inject Leaflet CSS if not already present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // 2. Dynamically import Leaflet to avoid Next.js SSR window errors
    import("leaflet").then((LModule) => {
      if (!isMounted || !containerRef.current) return;
      const L = LModule.default || LModule;

      // Avoid re-initialization on same element
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Determine initial center and zoom
      let centerLat = 29.1872;
      let centerLng = -82.1401;
      let zoom = 10;

      if (props.mode === "property") {
        centerLat = Number(props.latitude) || 29.1872;
        centerLng = Number(props.longitude) || -82.1401;
        zoom = 12;
      } else if (props.mode === "wizard") {
        centerLat = Number(props.latitude) || 29.1872;
        centerLng = Number(props.longitude) || -82.1401;
        zoom = 13;
      } else if (props.mode === "browse" && props.listings.length > 0) {
        const valid = props.listings.find(
          (l) => Number(l.latitude) && Number(l.longitude)
        );
        if (valid) {
          centerLat = Number(valid.latitude);
          centerLng = Number(valid.longitude);
        }
      }

      const map = L.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // CartoDB Voyager tiles — elegant, warm tones matching the estate cream/forest design
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ).addTo(map);

      // Render mode-specific markers
      if (props.mode === "browse") {
        props.listings.forEach((listing) => {
          const lat = Number(listing.latitude);
          const lng = Number(listing.longitude);
          if (!isFinite(lat) || !isFinite(lng) || lat === 0 || lng === 0) return;

          const isSelected = selectedId === listing.id;

          const iconHtml = `
            <div style="
              display: inline-block;
              padding: 4px 10px;
              background-color: ${isSelected ? "#E1B534" : "#1F3A2B"};
              color: #ffffff;
              font-family: sans-serif;
              font-size: 12px;
              font-weight: 700;
              border-radius: 9999px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.15);
              cursor: pointer;
              transform: translate(-50%, -50%);
              user-select: none;
              border: ${isSelected ? "2px solid #ffffff" : "none"};
              white-space: nowrap;
            ">
              $${listing.price_per_night || 0}
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: "mes-leaflet-marker",
            iconSize: [50, 24],
            iconAnchor: [25, 12],
          });

          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

          marker.on("click", () => {
            setActiveListing(listing);
            setSelectedId(listing.id);
            props.onSelectListing?.(listing.id);
            map.panTo([lat, lng], { animate: true });
          });
        });
      } else if (props.mode === "property") {
        const lat = Number(props.latitude) || 29.1872;
        const lng = Number(props.longitude) || -82.1401;

        // Approximate circular privacy zone
        L.circle([lat, lng], {
          radius: 2000,
          color: "#E1B534",
          fillColor: "#E1B534",
          fillOpacity: 0.18,
          weight: 2,
        }).addTo(map);

        const centerBadgeHtml = `
          <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -50%); pointer-events:none; select-none;">
            <div style="width:36px; height:36px; border-radius:9999px; background:rgba(225,181,52,0.25); display:flex; align-items:center; justify-content:center;">
              <div style="width:20px; height:20px; border-radius:9999px; background:#E1B534; box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
            <span style="margin-top:6px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#1F3A2B; background:rgba(255,255,255,0.95); padding:2px 10px; border-radius:9999px; border:1px solid #E5E0D6; box-shadow:0 2px 4px rgba(0,0,0,0.08); white-space:nowrap;">
              Approximate area · ${props.city || "Ocala"}, FL
            </span>
          </div>
        `;

        const centerIcon = L.divIcon({
          html: centerBadgeHtml,
          className: "mes-property-pin",
          iconSize: [160, 60],
          iconAnchor: [80, 30],
        });

        L.marker([lat, lng], { icon: centerIcon, interactive: false }).addTo(map);
      } else if (props.mode === "wizard") {
        const lat = Number(props.latitude) || 29.1872;
        const lng = Number(props.longitude) || -82.1401;

        const wizardPinHtml = `
          <div style="transform: translate(-50%, -100%); display:flex; flex-direction:column; align-items:center; cursor:grab;">
            <div style="width:32px; height:32px; border-radius:9999px; background:#1F3A2B; border:2px solid #ffffff; box-shadow:0 4px 8px rgba(0,0,0,0.3); display:grid; place-items:center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="width:2px; height:8px; background:#1F3A2B;"></div>
          </div>
        `;

        const wizardIcon = L.divIcon({
          html: wizardPinHtml,
          className: "mes-wizard-pin",
          iconSize: [32, 40],
          iconAnchor: [16, 40],
        });

        const draggableMarker = L.marker([lat, lng], {
          icon: wizardIcon,
          draggable: true,
        }).addTo(map);

        draggableMarker.on("dragend", () => {
          const pos = draggableMarker.getLatLng();
          props.onMarkerDragEnd(pos.lat, pos.lng);
        });
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [props]);

  return (
    <div
      className={`relative ${props.className ?? ""}`}
      data-testid="leaflet-map-container"
    >
      <div ref={containerRef} className="w-full h-full min-h-[300px]" />

      {/* Interactive preview card */}
      {props.mode === "browse" && activeListing && (
        <ListingPreviewCard
          listing={activeListing}
          onClose={() => {
            setActiveListing(null);
            setSelectedId(null);
            props.onSelectListing?.(null);
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Google Map Wrapper with Seamless Fallback
   ───────────────────────────────────────────────────────────── */

export function GoogleMapWrapper(props: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const [loadError, setLoadError] = useState(false);

  // Selected listing state for browse mode preview card
  const [activeListing, setActiveListing] = useState<ListingWithPhotos | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    props.mode === "browse" ? props.selectedListingId ?? null : null
  );

  useEffect(() => {
    if (props.mode === "browse" && props.selectedListingId !== undefined) {
      setSelectedId(props.selectedListingId);
      if (props.selectedListingId) {
        const found = props.listings.find((l) => l.id === props.selectedListingId);
        if (found) setActiveListing(found);
      }
    }
  }, [props]);

  // Seamless fallback to Leaflet / OpenStreetMap if API key is not configured or fails to load
  if (!apiKey || loadError) {
    return <LeafletMapView {...props} />;
  }

  // Google Maps settings
  let defaultCenter = { lat: 29.1872, lng: -82.1401 };
  let defaultZoom = 10;

  if (props.mode === "property") {
    defaultCenter = {
      lat: Number(props.latitude) || 29.1872,
      lng: Number(props.longitude) || -82.1401,
    };
    defaultZoom = 12;
  } else if (props.mode === "wizard") {
    defaultCenter = {
      lat: Number(props.latitude) || 29.1872,
      lng: Number(props.longitude) || -82.1401,
    };
    defaultZoom = 13;
  } else if (props.mode === "browse" && props.listings.length > 0) {
    const valid = props.listings.find(
      (l) => Number(l.latitude) && Number(l.longitude)
    );
    if (valid) {
      defaultCenter = {
        lat: Number(valid.latitude),
        lng: Number(valid.longitude),
      };
    }
  }

  return (
    <MapErrorBoundary className={props.className}>
      <div
        className={`relative ${props.className ?? ""}`}
        data-testid="google-map-container"
      >
        <APIProvider apiKey={apiKey} onError={() => setLoadError(true)}>
          <Map
            mapId="mes-map"
            reuseMaps={true}
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            mapTypeId="terrain"
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              if (props.mode === "browse") {
                setActiveListing(null);
                setSelectedId(null);
                props.onSelectListing?.(null);
              }
            }}
          >
            {props.mode === "browse" && (
              <GoogleBrowseMarkers
                listings={props.listings}
                selectedId={selectedId}
                onSelect={(listing) => {
                  setActiveListing(listing);
                  setSelectedId(listing.id);
                  props.onSelectListing?.(listing.id);
                }}
              />
            )}

            {props.mode === "property" && (
              <GooglePropertyZoneOverlay
                lat={Number(props.latitude) || 29.1872}
                lng={Number(props.longitude) || -82.1401}
                city={props.city}
              />
            )}

            {props.mode === "wizard" && (
              <GoogleWizardMarker
                position={{
                  lat: Number(props.latitude) || 29.1872,
                  lng: Number(props.longitude) || -82.1401,
                }}
                onDragEnd={props.onMarkerDragEnd}
              />
            )}
          </Map>
        </APIProvider>

        {/* Floating preview card for selected marker */}
        {props.mode === "browse" && activeListing && (
          <ListingPreviewCard
            listing={activeListing}
            onClose={() => {
              setActiveListing(null);
              setSelectedId(null);
              props.onSelectListing?.(null);
            }}
          />
        )}
      </div>
    </MapErrorBoundary>
  );
}
