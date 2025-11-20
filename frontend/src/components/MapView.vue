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
  <div>
    <!-- Conteneur de la carte Leaflet -->
    <div id="map" class="h-[28rem] md:h-[40rem] w-full border rounded-lg shadow bg-gray-200"></div>

    <!-- Outils de développement (visible uniquement en mode dev) -->
    <div v-if="isDev" class="mt-4 flex justify-center">
      <button @click="showMarkerData = !showMarkerData" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs">
        {{ showMarkerData ? 'Hide' : 'Show' }} Marker Data ({{ markerPositions.length }})
      </button>
    </div>

    <!-- Données de débogage des marqueurs -->
    <div v-if="isDev && showMarkerData && markerPositions.length > 0" class="mt-4 bg-gray-100 p-3 rounded text-xs font-mono max-h-48 overflow-y-auto">
      <p class="font-semibold mb-1">Marker Positions JSON:</p>
      <pre>{{ JSON.stringify(markerPositions, null, 2) }}</pre>
    </div>

    <!-- Système de widgets superposé -->
    <Widget
      v-if="selectedLocation"
      :location="selectedLocation"
      @close="closeWidget"
      @purchased="handleLocationPurchased"
    />
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
import { locationService } from '../services/locationService';
import { clickIcon } from '../utils/map/iconsMarkers';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { isPrestataire } from '@/services/roleService';
import Widget from './widgets/Widget.vue';
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
const selectedLocation = ref<LocationMock | null>(null);
const isDev = import.meta.env.DEV;

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
  // Close the widget
  closeWidget();
}

/**
 * Ajoute les marqueurs de location filtrés sur la carte
 * Filtre les locations selon le rôle utilisateur et intègre le système de widgets
 */
async function addFilteredLocationsToMap() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const currentUser = user.value;
  const userRole = isPrestataire(currentUser) ? 'prestataire' : 'other';

  await locationService.addLocationsToMap(map, markers, userRole, (location: LocationMock) => {
    selectedLocation.value = location;
  });
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