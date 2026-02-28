export interface GeoLocation {
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
}