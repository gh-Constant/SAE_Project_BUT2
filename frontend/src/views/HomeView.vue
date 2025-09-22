<template>
  <div class="bg-gray-50">
    <section class="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center py-24 md:py-32">
      <div class="max-w-5xl mx-auto px-4">
        <h1 class="text-7xl md:text-9xl font-black mb-6 animate-fade-in-down" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.02em; line-height: 0.9; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
          {{ t('home.hero.title') }}
        </h1>
        <p class="text-xl md:text-2xl max-w-4xl mx-auto mb-16 animate-fade-in-up text-center leading-relaxed" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
          <a href="#map-section" class="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-full text-xl transition-all transform hover:scale-105 duration-300 ease-in-out shadow-xl">
            {{ t('home.hero.cta') }}
          </a>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-5xl font-extrabold text-gray-900" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">{{ t('home.features.title') }}</h2>
          <p class="mt-4 text-lg text-gray-600">{{ t('home.features.subtitle') }}</p>
        </div>
        <div class="mt-12 grid gap-10 md:grid-cols-3">
          <div class="text-center p-6 border border-orange-200 rounded-xl hover:shadow-xl transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10V7m0 0L5 4m4 3l6-3m6 3l4-2"></path></svg>
            </div>
            <h3 class="mt-5 text-lg font-medium text-gray-900">{{ t('home.features.discover.title') }}</h3>
            <p class="mt-2 text-base text-gray-600">{{ t('home.features.discover.description') }}</p>
          </div>
          <div class="text-center p-6 border border-orange-200 rounded-xl hover:shadow-xl transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="mt-5 text-lg font-medium text-gray-900">{{ t('home.features.events.title') }}</h3>
            <p class="mt-2 text-base text-gray-600">{{ t('home.features.events.description') }}</p>
          </div>
          <div class="text-center p-6 border border-orange-200 rounded-xl hover:shadow-xl transition-shadow bg-orange-50">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 class="mt-5 text-lg font-medium text-gray-900">{{ t('home.features.community.title') }}</h3>
            <p class="mt-2 text-base text-gray-600">{{ t('home.features.community.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="map-section" class="bg-gradient-to-br from-blue-50 to-indigo-100 p-5 md:py-24 md:px-10">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 class="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-6 md:mb-8" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">
            {{ t('map.title') }}
          </h2>
          <div
            id="map"
            class="h-96 md:h-[600px] w-full border-2 border-gray-300 rounded-xl shadow-lg bg-gray-200"
          />
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 italic bg-gray-50 rounded-lg p-3 inline-block">
              {{ t('map.instructions') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-orange-50">
      <div class="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-5xl font-extrabold text-gray-900" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.01em;">
          {{ t('home.cta.title') }}
        </h2>
        <p class="mt-4 text-lg leading-6 text-gray-600">
          {{ t('home.cta.subtitle') }}
        </p>
        <a href="/register" class="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 sm:w-auto">
          {{ t('home.cta.button') }}
        </a>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// Your existing script remains unchanged.
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { addPredefinedMarkers } from '../utils/map/predefinedMarkers';
import { clickIcon } from '../utils/map/iconsMarkers';

const { t } = useI18n();

let map: L.Map;
let markers: L.Marker[] = [];

function setupLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker.png',
  });
}

function addClickMarker(e: L.LeafletMouseEvent) {
  const marker = L.marker(e.latlng, { icon: clickIcon })
    .addTo(map)
    .bindPopup(t('map.popup', { lat: e.latlng.lat.toFixed(0), lng: e.latlng.lng.toFixed(0) }))
    .openPopup();
  marker.on('click', () => {
    map.removeLayer(marker);
    const index = markers.indexOf(marker);
    if (index > -1) {
      markers.splice(index, 1);
    }
  });
  markers.push(marker);
}

function initializeMap() {
  // Check if the map container exists before initializing
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Prevent re-initialization
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

  if (import.meta.env.DEV) {
    map.on('click', addClickMarker);
  }
});
</script>