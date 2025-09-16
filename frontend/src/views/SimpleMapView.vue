<template>
  <div class="p-5 md:p-10 max-w-7xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-5 md:mb-8">
      Simple Interactive Map
    </h1>
    <div
      id="map"
      class="h-96 md:h-[500px] w-full border border-gray-300 rounded-lg shadow-lg"
    />
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600 italic">
        Click on the map to add markers. Click on markers to remove them.
      </p>
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

  // Add zoom control with custom options
  L.control.zoom({
    position: 'topleft',
    zoomInTitle: 'Zoom in (+)',
    zoomOutTitle: 'Zoom out (-)'
  }).addTo(map);

  // Disable double-click zoom to prevent accidental zooming
  map.doubleClickZoom.disable();

  // Add a default marker at the center of your image
  const defaultMarker = L.marker([imageHeight/2, imageWidth/2])
    .addTo(map)
    .bindPopup('Center of your custom map')
    .openPopup();
  
  markers.push(defaultMarker);

  // Handle map clicks to add new markers
  map.on('click', (e) => {
    const marker = L.marker(e.latlng)
      .addTo(map)
      .bindPopup(`Marker at ${e.latlng.lat.toFixed(0)}, ${e.latlng.lng.toFixed(0)}`)
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
