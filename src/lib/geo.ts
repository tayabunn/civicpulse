/**
 * Geospatial utilities for distance calculation and radius detection using Haversine formula.
 */

const EARTH_RADIUS_METERS = 6371000;

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates distance in meters between two GPS coordinates using Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Checks whether coordinate 2 is within radiusMeters of coordinate 1.
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusMeters: number
): boolean {
  return calculateDistanceMeters(lat1, lon1, lat2, lon2) <= radiusMeters;
}

/**
 * Generates bounding box coordinates for fast SQL indexed filtering before Haversine exact distance.
 */
export function getBoundingBox(
  lat: number,
  lon: number,
  radiusMeters: number
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  const latDelta = (radiusMeters / EARTH_RADIUS_METERS) * (180 / Math.PI);
  const lonDelta =
    ((radiusMeters / EARTH_RADIUS_METERS) * (180 / Math.PI)) /
    Math.cos(toRadians(lat));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}
