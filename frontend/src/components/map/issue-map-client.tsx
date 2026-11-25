'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Issue } from '../../types';
import { createCustomMarkerHtml } from './marker-icons';
import { Badge } from '../ui/badge';
import { getStatusBadgeClass, getStatusLabel, getPriorityBadgeClass, getPriorityLabel, formatDate } from '../../lib/utils';
import Link from 'next/link';

interface IssueMapClientProps {
  issues: Issue[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: Issue) => void;
  center?: [number, number];
  zoom?: number;
  highlightRadiusMeters?: number;
  className?: string;
}

// Controller component to smoothly fly to selected pin
function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export function IssueMapClient({
  issues,
  selectedIssueId,
  onSelectIssue,
  center = [23.8103, 90.4125], // Default Dhaka center
  zoom = 12,
  highlightRadiusMeters = 50,
  className,
}: IssueMapClientProps) {
  const selectedIssue = issues.find((i) => i.id === selectedIssueId);
  const activeCenter: [number, number] = selectedIssue
    ? [selectedIssue.latitude, selectedIssue.longitude]
    : center;

  return (
    <div className={`w-full h-full min-h-[400px] relative rounded-xl overflow-hidden ${className || ''}`}>
      <MapContainer
        center={activeCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={selectedIssue ? activeCenter : undefined} />

        {/* Selected Issue 50m Duplicate Radius Circle */}
        {selectedIssue && (
          <Circle
            center={[selectedIssue.latitude, selectedIssue.longitude]}
            radius={highlightRadiusMeters}
            pathOptions={{
              color: '#e2fa6b',
              fillColor: '#e2fa6b',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* Issue Pins */}
        {issues.map((issue) => {
          const isSelected = issue.id === selectedIssueId;
          const customIcon = L.divIcon({
            html: createCustomMarkerHtml(issue.category, issue.priority, isSelected),
            className: 'custom-leaflet-icon',
            iconSize: [32, 38],
            iconAnchor: [16, 38],
            popupAnchor: [0, -36],
          });

          return (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => onSelectIssue && onSelectIssue(issue),
              }}
            >
              <Popup className="custom-issue-popup">
                <div className="p-1 min-w-[220px] max-w-[260px]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">
                      {issue.trackingCode}
                    </span>
                    <Badge className={getPriorityBadgeClass(issue.priority)}>
                      {getPriorityLabel(issue.priority)}
                    </Badge>
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-1 mb-1">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2">{issue.address}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <Badge className={getStatusBadgeClass(issue.status)}>
                      {getStatusLabel(issue.status)}
                    </Badge>
                    <Link
                      href={`/citizen/issues/${issue.id}`}
                      className="text-xs font-semibold text-brand-cobalt hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
export default IssueMapClient;
