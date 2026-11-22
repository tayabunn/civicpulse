"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRadians = toRadians;
exports.calculateDistanceMeters = calculateDistanceMeters;
exports.isWithinRadius = isWithinRadius;
exports.getBoundingBox = getBoundingBox;
const EARTH_RADIUS_METERS = 6371000;
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
}
function isWithinRadius(lat1, lon1, lat2, lon2, radiusMeters) {
    return calculateDistanceMeters(lat1, lon1, lat2, lon2) <= radiusMeters;
}
function getBoundingBox(lat, lon, radiusMeters) {
    const latDelta = (radiusMeters / EARTH_RADIUS_METERS) * (180 / Math.PI);
    const lonDelta = ((radiusMeters / EARTH_RADIUS_METERS) * (180 / Math.PI)) /
        Math.cos(toRadians(lat));
    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLon: lon - lonDelta,
        maxLon: lon + lonDelta,
    };
}
