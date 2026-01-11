<!--
  @file MapView.vue
  @description
  Composant principal d'affichage de la carte interactive avec système de widgets.
  Gère l'initialisation de la carte Leaflet et l'intégration des marqueurs.

  @utilité
  - Initialise et configure la carte Leaflet avec l'image personnalisée
  - Gère l'affichage conditionnel des marqueurs selon le rôle utilisateur
  - Intègre le système de widgets pour l'interaction avec les locations
  - Fournit des outils de développement pour déboguer les positions
  - Supporte les événements de clic sur les marqueurs

  @dépendances
  - Leaflet: Bibliothèque de cartographie
  - locationService: Service de gestion des locations
  - Widget: Système de widgets pour les interactions
  - Auth store: Gestion de l'état d'authentification

  @remarques
  - Utilise une projection simple (CRS.Simple) pour l'image statique
  - Les marqueurs sont filtrés selon le rôle (prestataire voit tout, autres voient story + acheté)
  - Le système de widgets est intégré via callback dans le service
-->
<template>
  <div class="relative w-full" :class="{ 'my-12': !isFullScreen, 'h-full': isFullScreen }">
    <!-- Conteneur de la carte Leaflet -->
    <div id="map" tabindex="0" class="w-full bg-parchment outline-none" :class="[
      isFullScreen ? 'h-full' : 'h-[35rem] md:h-[45rem] rounded-lg'
    ]"></div>

    <!-- Outils de développement (visible uniquement en mode dev) -->
    <div v-if="isDev" class="absolute top-4 right-4 z-[1000] flex flex-col items-end pointer-events-none gap-2">
      <div class="flex gap-2 pointer-events-auto">
        <button @click="isClickDebugActive = !isClickDebugActive"
          class="bg-gray-900/80 hover:bg-gray-800 text-white font-medium py-1.5 px-3 rounded-lg text-xs backdrop-blur-sm transition-all shadow-sm border border-white/10"
          :class="{ 'ring-2 ring-green-500 text-green-400': isClickDebugActive }">
          {{ isClickDebugActive ? 'Click Debug ON' : 'Click Debug OFF' }}
        </button>
        <button @click="showMarkerData = !showMarkerData"
          class="bg-gray-900/80 hover:bg-gray-800 text-white font-medium py-1.5 px-3 rounded-lg text-xs backdrop-blur-sm transition-all shadow-sm border border-white/10">
          {{ showMarkerData ? 'Hide' : 'Show' }} JSON ({{ markerPositions.length }})
        </button>
      </div>

      <!-- Données de débogage des marqueurs -->
      <div v-if="showMarkerData && markerPositions.length > 0"
        class="pointer-events-auto mt-2 bg-white/95 p-4 rounded-lg text-xs font-mono max-h-[20rem] overflow-y-auto shadow-xl backdrop-blur-md border border-gray-200 max-w-xs">
        <p class="font-bold mb-2 text-gray-800 border-b pb-1">Marker Positions JSON</p>
        <pre class="text-gray-600 leading-relaxed">{{ JSON.stringify(markerPositions, null, 2) }}</pre>
      </div>
    </div>

    <!-- Système de widgets superposé -->
    <Widget v-if="selectedLocation" :location="selectedLocation" @close="closeWidget"
      @purchased="handleLocationPurchased" />
  </div>
</template>

<script setup lang="ts">
/**
 * Script du composant MapView
 * Gère l'initialisation de la carte et l'intégration des widgets
 */

import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService } from '@/services/locationService';
import { clickIcon } from '@/utils/map/iconsMarkers';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { isPrestataire, isAdmin } from '@/services/roleService';
import Widget from '@/components/widgets/Widget.vue';
import { LocationMock } from '@/mocks/locations';

const { t } = useI18n();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/**
 * Variables réactives et références pour la gestion de l'état
 */
let map: L.Map;
let markers: L.Marker[] = [];
const markerPositions = ref<number[][]>([]);
const showMarkerData = ref(false);
const isClickDebugActive = ref(false);
const selectedLocation = ref<LocationMock | null>(null);
const isDev = import.meta.env.DEV;

defineProps({
  isFullScreen: {
    type: Boolean,
    default: false
  }
});

/**
 * Configure les icônes par défaut de Leaflet
 * Remplace les icônes par défaut par notre icône personnalisée
 */
function setupLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker.png',
  });
}

/**
 * Ajoute un marqueur de débogage sur la carte (mode développement uniquement)
 * Permet de tester les positions et interactions sur la carte
 */
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

/**
 * Initialise la carte Leaflet avec l'image personnalisée
 * Configure la projection simple et les limites de l'image
 */
function initializeMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  if (map) {
    map.remove();
  }

  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2.3,
    maxZoom: 4,
    zoomDelta: 0.5,
    zoomSnap: 0.1,
    wheelDebounceTime: 40,
    wheelPxPerZoomLevel: 60,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false
  }).setView([250, 250], 0);

  const imageUrl = './maps/75shrinkcompressed.png';
  const imageWidth = 6500;
  const imageHeight = 3300;
  const imageBounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]];
  L.imageOverlay(imageUrl, imageBounds).addTo(map);
  map.fitBounds(imageBounds);

  // Enable scroll zoom only when focused
  map.on('focus', () => {
    map.scrollWheelZoom.enable();
  });

  map.on('blur', () => {
    map.scrollWheelZoom.disable();
    map.fitBounds(imageBounds);
  });
}

/**
 * Ferme le widget actuellement ouvert
 * Réinitialise la location sélectionnée
 */
function closeWidget() {
  selectedLocation.value = null;
}

/**
 * Gère l'événement de purchase d'une location
 * Rafraîchit la carte pour afficher les changements
 */
async function handleLocationPurchased(location: LocationMock) {
  console.log('Location purchased:', location);
  // Refresh the map to show updated locations
  await addFilteredLocationsToMap();
}

/**
 * Ajoute les marqueurs de location filtrés sur la carte
 * Filtre les locations selon le rôle utilisateur et intègre le système de widgets
 */
async function addFilteredLocationsToMap() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const currentUser = user.value;
  const userRole = isAdmin(currentUser) ? 'admin' : (isPrestataire(currentUser) ? 'prestataire' : 'other');

  await locationService.addLocationsToMap(map, markers, userRole, (location: LocationMock) => {
    selectedLocation.value = location;
  });
}

onMounted(async () => {
  setupLeafletIcons();
  initializeMap();
  await addFilteredLocationsToMap();

  await addFilteredLocationsToMap();
});

watch(isClickDebugActive, (newValue) => {
  if (!map) return;

  if (newValue) {
    map.on('click', addClickMarker);
    map.getContainer().style.cursor = 'crosshair';
  } else {
    map.off('click', addClickMarker);
    map.getContainer().style.cursor = '';
  }
});

watch(user, async () => {
  await addFilteredLocationsToMap();
});
</script>

<style scoped>
#map {
  background-color: var(--color-parchment);
}
</style>