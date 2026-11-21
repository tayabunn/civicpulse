'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const DynamicLocationPicker = dynamic(() => import('./location-picker-client'), {
  ssr: false,
  loading: () => <Skeleton className="h-60 w-full rounded-xl" />,
});

export interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lon: number) => void;
}

export function LocationPicker(props: LocationPickerProps) {
  return <DynamicLocationPicker {...props} />;
}
