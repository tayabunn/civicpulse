'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatCoords } from '../../lib/utils';
import {
  MapPin,
  Navigation,
  AlertCircle,
  CheckCircle2,
  Search,
  Layers,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/button';

interface LocationPickerClientProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lon: number) => void;
  onAddressChange?: (address: string) => void;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state_district?: string;
  };
}

function formatShortAddress(data: NominatimResult): string {
  const addr = data.address;
  if (addr) {
    const parts = [
      addr.road,
      addr.neighbourhood || addr.suburb,
      addr.city || addr.town || addr.village || addr.state_district,
    ].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }
  return data.display_name.split(',').slice(0, 3).join(',').trim();
}

function MapClickHandler({
  onSelectLocation,
}: {
  onSelectLocation: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 15), { duration: 0.7 });
  }, [latitude, longitude, map]);
  return null;
}

const pinIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-full bg-[#315CFF] border-2 border-white shadow-xl flex items-center justify-center text-white">
        📍
      </div>
    </div>
  `,
  className: 'location-picker-pin',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export function LocationPickerClient({
  latitude,
  longitude,
  onChange,
  onAddressChange,
}: LocationPickerClientProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [mapMode, setMapMode] = useState<'street' | 'satellite'>('street');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Address Search via free OpenStreetMap Nominatim
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}&limit=5&addressdetails=1`,
          {
            headers: { 'Accept-Language': 'en' },
          }
        );
        if (res.ok) {
          const data: NominatimResult[] = await res.json();
          setSearchResults(data);
          setShowSuggestions(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reverse Geocode coordinates to human-readable Street Address
  const reverseGeocode = async (lat: number, lon: number) => {
    if (!onAddressChange) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
        }
      );
      if (res.ok) {
        const data: NominatimResult = await res.json();
        if (data?.display_name) {
          onAddressChange(formatShortAddress(data));
        }
      }
    } catch {}
  };

  const handleSelectLocation = (lat: number, lon: number) => {
    onChange(lat, lon);
    reverseGeocode(lat, lon);
  };

  const handleSelectSearchResult = (item: NominatimResult) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      onChange(lat, lon);
      const formatted = formatShortAddress(item);
      setSearchQuery(formatted);
      setShowSuggestions(false);
      if (onAddressChange) {
        onAddressChange(formatted);
      }
      setGpsStatus({
        type: 'success',
        message: `Pinned: ${formatted}`,
      });
    }
  };

  const handleUseGPS = () => {
    setGpsStatus(null);

    if (!navigator.geolocation) {
      setGpsStatus({
        type: 'error',
        message:
          'Geolocation is not supported by your browser. Search an address or click on the map.',
      });
      return;
    }

    setIsLocating(true);

    const onSuccess = (pos: GeolocationPosition, isApprox = false) => {
      handleSelectLocation(pos.coords.latitude, pos.coords.longitude);
      setIsLocating(false);
      setGpsStatus({
        type: 'success',
        message: isApprox
          ? 'Approximate location detected & address updated. Click map to fine-tune.'
          : 'GPS coordinates locked & address updated.',
      });
    };

    const tryApproximateOrFallback = async (err: GeolocationPositionError) => {
      if (err.code === err.PERMISSION_DENIED) {
        setIsLocating(false);
        setGpsStatus({
          type: 'error',
          message:
            'Location permission denied. Allow Location in your browser address bar, search above, or click the map.',
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => onSuccess(pos, true),
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
              const data = await res.json();
              if (typeof data?.latitude === 'number' && typeof data?.longitude === 'number') {
                handleSelectLocation(data.latitude, data.longitude);
                setIsLocating(false);
                setGpsStatus({
                  type: 'success',
                  message:
                    'Approximate network location set. Search or click the map to refine the exact pin.',
                });
                return;
              }
            }
          } catch {}

          setIsLocating(false);
          setGpsStatus({
            type: 'error',
            message:
              'Could not retrieve GPS coordinates. Use the search bar above or click directly on the map.',
          });
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => onSuccess(pos, false),
      (err) => {
        tryApproximateOrFallback(err);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  return (
    <div className="flex-1 flex flex-col space-y-3 h-full">
      {/* Free Address Search / Autocomplete Bar */}
      <div className="relative" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (searchResults.length > 0) setShowSuggestions(true);
            }}
            placeholder="Search area or street (e.g. Dhanmondi 27, Banani, Mirpur 10)..."
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[#315CFF] focus:border-[#315CFF]"
          />
          {isSearching ? (
            <Loader2 size={14} className="absolute right-3 animate-spin text-[#315CFF]" />
          ) : (
            searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-2.5 p-0.5 rounded text-text-muted hover:text-text-primary"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )
          )}
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 rounded-xl bg-surface border border-border shadow-xl z-[1000] max-h-52 overflow-y-auto divide-y divide-border">
            {searchResults.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-surface-secondary transition-colors flex items-start gap-2.5"
              >
                <MapPin size={14} className="text-[#315CFF] shrink-0 mt-0.5" />
                <span className="text-text-primary line-clamp-2">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Coordinates & Use GPS */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm font-mono font-medium text-text-secondary">
          <MapPin size={15} className="text-[#315CFF] shrink-0" />
          <span>Coordinates: {formatCoords(latitude, longitude)}</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleUseGPS}
          isLoading={isLocating}
          className="text-xs gap-1.5 shrink-0"
        >
          <Navigation size={12} />
          Use GPS
        </Button>
      </div>

      {gpsStatus && (
        <div
          className={`px-3 py-2 rounded-lg text-[11px] flex items-center gap-2 border ${
            gpsStatus.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
          }`}
        >
          {gpsStatus.type === 'success' ? (
            <CheckCircle2 size={13} className="shrink-0" />
          ) : (
            <AlertCircle size={13} className="shrink-0" />
          )}
          <span>{gpsStatus.message}</span>
        </div>
      )}

      {/* Map Container with Street / Satellite Switcher */}
      <div className="relative flex-1 min-h-[380px] w-full rounded-xl overflow-hidden border border-border">
        {/* Street / Satellite View Toggle Pill */}
        <div className="absolute top-2.5 right-2.5 z-[500] flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#141B29] border border-border shadow-md">
          <button
            type="button"
            onClick={() => setMapMode('street')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              mapMode === 'street'
                ? 'bg-[#315CFF] text-white'
                : 'text-text-secondary hover:bg-surface-secondary'
            }`}
          >
            <MapPin size={11} />
            Street
          </button>
          <button
            type="button"
            onClick={() => setMapMode('satellite')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              mapMode === 'satellite'
                ? 'bg-[#315CFF] text-white'
                : 'text-text-secondary hover:bg-surface-secondary'
            }`}
          >
            <Layers size={11} />
            Satellite
          </button>
        </div>

        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          {mapMode === 'street' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          <MapClickHandler onSelectLocation={handleSelectLocation} />
          <MapRecenter latitude={latitude} longitude={longitude} />
          <Marker position={[latitude, longitude]} icon={pinIcon} />
        </MapContainer>
      </div>
      <p className="text-xs sm:text-sm text-text-muted">
        Search an address above, switch to Satellite view, or click anywhere on the map to pin &amp; auto-fill the street address.
      </p>
    </div>
  );
}
export default LocationPickerClient;
