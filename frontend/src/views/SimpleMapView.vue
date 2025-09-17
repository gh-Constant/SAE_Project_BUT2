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
import { addPredefinedMarkers } from '../utils/map/predefinedMarkers';
import { clickIcon } from '../utils/map/iconsMarkers';

let map: L.Map;
let markers: L.Marker[] = [];

function setupLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker.png',
  });
}

function initializeMap() {
  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 4,
    zoomDelta: 0.5,
    wheelDebounceTime: 100,
    wheelPxPerZoomLevel: 120
  }).setView([250, 250], 0);

  const imageUrl = './maps/50shrinkcompressed.png';
  const imageWidth = 6500;
  const imageHeight = 3300;
  const imageBounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]];
  L.imageOverlay(imageUrl, imageBounds).addTo(map);
  map.fitBounds(imageBounds);
}



onMounted(() => {
  setupLeafletIcons();
  initializeMap();
  addPredefinedMarkers(map, markers);
  map.on('click', (e) => {
    const marker = L.marker(e.latlng, { icon: clickIcon })
      .addTo(map)
      .bindPopup(`Location at ${e.latlng.lat.toFixed(0)}, ${e.latlng.lng.toFixed(0)}`)
      .openPopup();
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
