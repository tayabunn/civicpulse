'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { formatCoords } from '../../lib/utils';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../ui/button';

interface LocationPickerClientProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lon: number) => void;
}

function MapClickHandler({ onChange }: { onChange: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const pinIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-full bg-brand-cobalt border-2 border-white shadow-xl flex items-center justify-center text-white">
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
}: LocationPickerClientProps) {
  const [isLocating, setIsLocating] = useState(false);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('Could not retrieve GPS coordinates. Please click on the map.');
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-text-secondary">
          <MapPin size={14} className="text-brand-cobalt" />
          <span>Coordinates: {formatCoords(latitude, longitude)}</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleUseGPS}
          isLoading={isLocating}
          className="text-xs gap-1.5"
        >
          <Navigation size={12} />
          Use GPS
        </Button>
      </div>

      <div className="h-60 w-full rounded-xl overflow-hidden border border-border">
        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onChange={onChange} />
          <Marker position={[latitude, longitude]} icon={pinIcon} />
        </MapContainer>
      </div>
      <p className="text-[11px] text-text-muted">
        Click anywhere on the map to accurately place the maintenance issue pin.
      </p>
    </div>
  );
}
export default LocationPickerClient;
