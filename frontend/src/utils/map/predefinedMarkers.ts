import L from 'leaflet';
import { houseIcon } from './iconsMarkers';

const predefinedMarkers = [
  {
    position: [1747, 5072] as L.LatLngExpression,
    icon: houseIcon,
    popup: 'House at 1747, 5072'
  }
];

export function addPredefinedMarkers(map: L.Map, markers: L.Marker[]) {
  predefinedMarkers.forEach(markerData => {
    const marker = L.marker(markerData.position, { icon: markerData.icon })
      .addTo(map)
      .bindPopup(markerData.popup);
    markers.push(marker);
  });
}