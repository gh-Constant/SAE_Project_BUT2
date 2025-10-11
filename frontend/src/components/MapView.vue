<template>
  <div>
    <div id="map" class="h-[28rem] md:h-[40rem] w-full border rounded-lg shadow bg-gray-200"></div>
    <div v-if="isDev" class="mt-4 flex justify-center">
      <button @click="showMarkerData = !showMarkerData" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs">
        {{ showMarkerData ? 'Hide' : 'Show' }} Marker Data ({{ markerPositions.length }})
      </button>
    </div>
    <div v-if="isDev && showMarkerData && markerPositions.length > 0" class="mt-4 bg-gray-100 p-3 rounded text-xs font-mono max-h-48 overflow-y-auto">
      <p class="font-semibold mb-1">Marker Positions JSON:</p>
      <pre>{{ JSON.stringify(markerPositions, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService } from '../services/locationService';
import { clickIcon } from '../utils/map/iconsMarkers';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { isPrestataire } from '@/services/roleService';

const { t } = useI18n();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

let map: L.Map;
let markers: L.Marker[] = [];
const markerPositions = ref<number[][]>([]);
const showMarkerData = ref(false);
const isDev = import.meta.env.DEV;

function setupLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker.png',
  });
}

function addClickMarker(e: L.LeafletMouseEvent) {
  const lat = Math.round(e.latlng.lat);
  const lng = Math.round(e.latlng.lng);
  const popupText = t('map.popup', { lat, lng });
  const marker = L.marker(e.latlng, { icon: clickIcon })
    .addTo(map)
    .bindPopup(popupText)
    .openPopup();

  markerPositions.value.push([lat, lng]);

  marker.on('click', () => {
    map.removeLayer(marker);
    const index = markers.indexOf(marker);
    if (index > -1) {
      markers.splice(index, 1);
      markerPositions.value.splice(index, 1);
    }
  });
  markers.push(marker);
}

function initializeMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  if (map) {
    map.remove();
  }

  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 4,
    zoomDelta: 0.5,
    wheelDebounceTime: 100,
    wheelPxPerZoomLevel: 120
  }).setView([250, 250], 0);

  const imageUrl = './maps/75shrinkcompressed.png';
  const imageWidth = 6500;
  const imageHeight = 3300;
  const imageBounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]];
  L.imageOverlay(imageUrl, imageBounds).addTo(map);
  map.fitBounds(imageBounds);
}

async function addFilteredLocationsToMap() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const currentUser = user.value;
  const userRole = isPrestataire(currentUser) ? 'prestataire' : 'other';

  await locationService.addLocationsToMap(map, markers, userRole);
}

onMounted(async () => {
  setupLeafletIcons();
  initializeMap();
  await addFilteredLocationsToMap();

  if (import.meta.env.DEV) {
    map.on('click', addClickMarker);
  }
});

watch(user, async () => {
  await addFilteredLocationsToMap();
});
</script>

<style scoped>
</style>