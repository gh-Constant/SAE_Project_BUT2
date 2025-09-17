<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-5 md:p-10">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
          Interactive Map Explorer
        </h1>
        <div
          id="map"
          class="h-96 md:h-[500px] w-full border-2 border-gray-300 rounded-xl shadow-lg bg-white"
        />
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 italic bg-gray-50 rounded-lg p-3 inline-block">
            🖱️ Click on the map to add markers • 🗑️ Click on markers to remove them
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let map: L.Map;
let markers: L.Marker[] = [];

onMounted(() => {
  // Fix Leaflet marker icons path
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker.png',
  });

  // Initialize the map - using image coordinates instead of geographic coordinates
  // For image overlays, we use pixel coordinates (0,0 is top-left)
  map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate system for image overlays
    minZoom: -2,
    maxZoom: 4,
    zoomDelta: 0.5, // Smaller zoom steps for more precise control
    wheelDebounceTime: 100, // Debounce wheel events to prevent multiple zooms
    wheelPxPerZoomLevel: 120 // Increase this to make zoom less sensitive
  }).setView([250, 250], 0); // Center the view

  // Define the image dimensions (adjust based on your map.png size)
  const imageUrl = './maps/50shrinkcompressed.png';
  const imageWidth = 6500; // Adjust to your actual image width
  const imageHeight = 3300; // Adjust to your actual image height
  
  // Define the image bounds in pixel coordinates
  // [y, x] format where [0,0] is top-left
  const imageBounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]];
  
  // Add your custom map.png as the main map overlay
  L.imageOverlay(imageUrl, imageBounds).addTo(map);
  
  // Fit the map to the image bounds
  map.fitBounds(imageBounds);


  // Disable double-click zoom to prevent accidental zooming
  map.doubleClickZoom.disable();

  // Add house marker at specified coordinates
  const houseIcon = L.divIcon({
    html: '<div style="position: relative; font-size: 20px; border: 1px solid black; background: white; border-radius: 3px; padding: 2px; margin-bottom: 8px;"><i class="bi bi-house" style="color: #007bff;"></i></div><div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 8px solid white; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);"></div>',
    className: 'house-marker',
    iconSize: [26, 34],
    iconAnchor: [13, 34]
  });

  const houseMarker = L.marker([1747, 5072], { icon: houseIcon })
    .addTo(map)
    .bindPopup('House at 1687, 5076');

  markers.push(houseMarker);

  // Handle map clicks to add new markers
  map.on('click', (e) => {
    const clickIcon = L.divIcon({
      html: '<div style="position: relative; font-size: 20px; border: 1px solid black; background: white; border-radius: 3px; padding: 2px; margin-bottom: 8px;"><i class="bi bi-geo-alt-fill" style="color: #dc3545;"></i></div><div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 8px solid white; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);"></div>',
      className: 'click-marker',
      iconSize: [26, 34],
      iconAnchor: [13, 34]
    });

    const marker = L.marker(e.latlng, { icon: clickIcon })
      .addTo(map)
      .bindPopup(`Location at ${e.latlng.lat.toFixed(0)}, ${e.latlng.lng.toFixed(0)}`)
      .openPopup();

    // Add click handler to remove marker
    marker.on('click', () => {
      map.removeLayer(marker);
      const index = markers.indexOf(marker);
      if (index > -1) {
        markers.splice(index, 1);
      }
    });

    markers.push(marker);
  });
});
</script>
