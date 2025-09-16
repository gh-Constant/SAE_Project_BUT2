<template>
  <div class="simple-map-container">
    <h1>Simple Interactive Map</h1>
    <div id="map" class="map"></div>
    <div class="map-info">
      <p>Click on the map to add markers. Click on markers to remove them.</p>
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

<style scoped>
.simple-map-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.map {
  height: 500px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-info {
  margin-top: 15px;
  text-align: center;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .simple-map-container {
    padding: 10px;
  }
  
  .map {
    height: 400px;
  }
}
</style>