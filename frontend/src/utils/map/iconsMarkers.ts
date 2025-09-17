import L from 'leaflet';

export const houseIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 20px; border: 1px solid black; background: white; border-radius: 3px; padding: 2px; margin-bottom: 8px;"><i class="bi bi-house" style="color: #007bff;"></i></div><div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 8px solid white; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'house-marker',
  iconSize: [26, 34],
  iconAnchor: [13, 34]
});

export const clickIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 20px; border: 1px solid black; background: white; border-radius: 3px; padding: 2px; margin-bottom: 8px;"><i class="bi bi-geo-alt-fill" style="color: #dc3545;"></i></div><div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 8px solid white; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'click-marker',
  iconSize: [26, 34],
  iconAnchor: [13, 34]
});