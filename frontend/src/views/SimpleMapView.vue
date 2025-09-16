<template>
  <div class="p-5 md:p-10 max-w-7xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-5 md:mb-8">
      Simple Interactive Map
    </h1>
    <div id="map" class="h-96 md:h-[500px] w-full border border-gray-300 rounded-lg shadow-lg"></div>
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600 italic">
        Click on the map to add markers. Click on markers to remove them.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let map: L.Map;
let markers: L.Marker[] = [];

onMounted(() => {
  // Initialize the map
  map = L.map('map').setView([48.8566, 2.3522], 13); // Paris coordinates

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add a default marker
  const defaultMarker = L.marker([48.8566, 2.3522])
    .addTo(map)
    .bindPopup('Paris, France')
    .openPopup();
  
  markers.push(defaultMarker);

  // Handle map clicks to add new markers
  map.on('click', (e) => {
    const marker = L.marker(e.latlng)
      .addTo(map)
      .bindPopup(`Marker at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`)
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