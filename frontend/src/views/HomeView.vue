<template>
  <div class="bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center py-12 md:py-16">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-black mb-4 animate-fade-in-down" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.02em; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
          {{ t('home.hero.title') }}
        </h1>
        <p class="text-base md:text-lg max-w-3xl mx-auto mb-8 animate-fade-in-up text-center leading-relaxed" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.15);">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
          <a href="#map-section" class="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full text-base transition-all transform hover:scale-105 duration-300 ease-in-out shadow-lg">
            {{ t('home.hero.cta') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-10 md:py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">{{ t('home.features.title') }}</h2>
          <p class="mt-3 text-base md:text-lg text-gray-600">{{ t('home.features.subtitle') }}</p>
        </div>
        <div class="mt-8 md:mt-10 grid gap-6 md:grid-cols-3">
          <div class="text-center p-4 border border-orange-200 rounded-lg hover:shadow-lg transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10V7m0 0L5 4m4 3l6-3m6 3l4-2"></path></svg>
            </div>
            <h3 class="mt-3 text-base font-medium text-gray-900">{{ t('home.features.discover.title') }}</h3>
            <p class="mt-1 text-sm text-gray-600">{{ t('home.features.discover.description') }}</p>
          </div>

          <div class="text-center p-4 border border-orange-200 rounded-lg hover:shadow-lg transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="mt-3 text-base font-medium text-gray-900">{{ t('home.features.events.title') }}</h3>
            <p class="mt-1 text-sm text-gray-600">{{ t('home.features.events.description') }}</p>
          </div>

          <div class="text-center p-4 border border-orange-200 rounded-lg hover:shadow-lg transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 class="mt-3 text-base font-medium text-gray-900">{{ t('home.features.community.title') }}</h3>
            <p class="mt-1 text-sm text-gray-600">{{ t('home.features.community.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section id="map-section" class="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 md:py-16 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 md:mb-6" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">
            {{ t('map.title') }}
          </h2>
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
          <div class="mt-4 text-center">
            <p class="text-xs md:text-sm text-gray-600 italic bg-gray-50 rounded p-2 inline-block">
              {{ t('map.instructions') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Marker Widget Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedMarker" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="closeMarkerWidget">
          <div class="absolute inset-0 bg-black opacity-50" @click="closeMarkerWidget"></div>
          <div class="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <MarkerWidget
              :title="selectedMarker.title"
              :bannerImage="selectedMarker.bannerImage"
              :owner="selectedMarker.owner"
              :type="selectedMarker.type"
              :cost="selectedMarker.cost"
              :purchased="selectedMarker.purchased"
              :description="selectedMarker.description"
              :additionalImages="selectedMarker.additionalImages"
              @close="closeMarkerWidget"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- CTA Section -->
    <section class="bg-orange-50">
      <div class="max-w-3xl mx-auto text-center py-10 px-4 sm:py-16 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">
          {{ t('home.cta.title') }}
        </h2>
        <p class="mt-3 text-base md:text-lg leading-5 text-gray-600">
          {{ t('home.cta.subtitle') }}
        </p>
        <a href="/register" class="mt-6 w-full inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-orange-600 hover:bg-orange-700 sm:w-auto">
          {{ t('home.cta.button') }}
        </a>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { addPredefinedMarkers, type MarkerData } from '../utils/map/predefinedMarkers';
import { clickIcon } from '../utils/map/iconsMarkers';
import MarkerWidget from '../components/MarkerWidget.vue';

const { t } = useI18n();

let map: L.Map;
let markers: L.Marker[] = [];
const markerPositions = ref<number[][]>([]);
const showMarkerData = ref(false);
const isDev = import.meta.env.DEV;
const selectedMarker = ref<MarkerData | null>(null);

function setupLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker.png',
  });
}

// Fonction pour les développeurs : permet d'ajouter des marqueurs en cliquant sur la carte en mode développement.
// Pratique pour tester les positions sans coder à chaque fois.
function addClickMarker(e: L.LeafletMouseEvent) {
  const lat = Math.round(e.latlng.lat);
  const lng = Math.round(e.latlng.lng);
  const popupText = t('map.popup', { lat, lng });
  const marker = L.marker(e.latlng, { icon: clickIcon })
    .addTo(map)
    .bindPopup(popupText)
    .openPopup();

  // Ajouter la position au tableau
    markerPositions.value.push([lat, lng]);

  marker.on('click', () => {
    map.removeLayer(marker);
    const index = markers.indexOf(marker);
    if (index > -1) {
      markers.splice(index, 1);
      // Retirer du tableau des positions
            markerPositions.value.splice(index, 1);
    }
  });
  markers.push(marker);
}

function closeMarkerWidget() {
  selectedMarker.value = null;
}

function handleMarkerClick(markerData: MarkerData) {
  selectedMarker.value = markerData;
}

function initializeMap() {
  // Vérifier si le conteneur de la carte existe avant d'initialiser
    const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Empêcher la ré-initialisation
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

onMounted(() => {
  setupLeafletIcons();
  initializeMap();
  addPredefinedMarkers(map, markers, handleMarkerClick);

  if (import.meta.env.DEV) {
    map.on('click', addClickMarker);
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
