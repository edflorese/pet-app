export interface Vet {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  opening_hours?: { open_now: boolean };
  geometry: { location: { lat: number; lng: number } };
}
