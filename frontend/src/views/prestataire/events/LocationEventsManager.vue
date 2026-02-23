<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <BackToMapButton />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">

      <!-- En-tête -->
      <div class="mb-8">
        <div class="flex gap-4 mb-6">
          <button @click="router.back()"
            class="inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group">
            <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {{ t('details.back') }}
          </button>

          <router-link :to="{ path: '/map', query: { locationId: locationId } }"
            class="inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group border-l border-antique-bronze/30 pl-4">
            <i class="fas fa-map-marked-alt mr-2"></i>
            {{ t('details.view_on_map') }}
            <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform text-xs"></i>
          </router-link>
        </div>

        <div
          class="bg-white/60 p-6 rounded-sm border-2 border-antique-bronze/20 shadow-sm text-center relative overflow-hidden">
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-antique-bronze to-transparent opacity-50">
          </div>

          <h3
            class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center gap-2 border-b border-antique-bronze/10 pb-4">
            <i class="fas fa-calendar-plus text-antique-bronze"></i>
            {{ isEditing ? t('prestataire.events.manager.form.submit_update') :
              t('prestataire.events.manager.form.submit_create') }}
          </h3>
          <p class="text-stone-grey font-bold flex items-center justify-center mt-2">
            <i class="fas fa-map-marker-alt mr-2 text-antique-bronze"></i>
            Lieu #{{ locationId }}
            <span class="mx-3 text-antique-bronze/40">|</span>
            <i class="fas fa-ticket-alt mr-2 text-antique-bronze"></i>
            {{ events.length }} événement(s)
          </p>

          <!-- Stats Row -->
          <div class="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-antique-bronze/10">
            <div class="text-center px-4">
              <div class="text-xs font-bold text-stone-grey uppercase tracking-widest mb-1">{{
                t('prestataire.events.manager.stats.sold') }}</div>
              <div class="text-2xl font-medieval font-bold text-antique-bronze">{{ totalSold }}</div>
            </div>
            <div class="w-px bg-antique-bronze/20 h-10 hidden sm:block"></div>
            <div class="text-center px-4">
              <div class="text-xs font-bold text-stone-grey uppercase tracking-widest mb-1">{{
                t('prestataire.events.manager.stats.revenue') }}</div>
              <div class="text-2xl font-medieval font-bold text-green-700">{{ totalRevenue }} G</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre d'outils (Recherche, Filtres, Création) -->
      <div
        class="mb-8 bg-white/60 rounded-sm shadow-sm p-4 border border-antique-bronze/20 flex flex-col md:flex-row gap-4 justify-between items-center">

        <!-- Recherche -->
        <div class="relative w-full md:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-antique-bronze/50"></i>
          </div>
          <input v-model="searchQuery" type="text" :placeholder="t('prestataire.events.search.placeholder')"
            class="block w-full pl-10 pr-10 py-2.5 bg-white/80 border border-antique-bronze/30 rounded-sm focus:ring-antique-bronze focus:border-antique-bronze text-stone-grey placeholder-stone-grey/50 font-body" />
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-antique-bronze transition-colors">
            <i class="fas fa-times text-stone-grey/50"></i>
          </button>
        </div>

        <!-- Bouton Créer -->
        <button @click="openCreateModal"
          class="w-full md:w-auto bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2.5 px-6 rounded-sm shadow-md transition-all flex items-center justify-center gap-2">
          <i class="fas fa-plus-circle"></i>
          {{ t('prestataire.events.manager.create_button') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse text-antique-bronze">Consultation des astres...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvents.length === 0"
        class="text-center py-16 bg-white/40 rounded-sm border-2 border-dashed border-antique-bronze/30">
        <i class="fas fa-calendar-times text-6xl text-antique-bronze/30 mb-4"></i>
        <h3 class="text-2xl font-medieval font-bold text-iron-black mb-3">
          {{ t('prestataire.events.manager.empty_search.title') }}
        </h3>
        <p class="text-stone-grey mb-6">
          {{ t('prestataire.events.manager.empty_search.description') }}
        </p>
        <button @click="openCreateModal" class="inline-flex items-center text-antique-bronze font-bold hover:underline">
          Créer un événement maintenant
        </button>
      </div>

      <!-- Grid of Events -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="event in filteredEvents" :key="event.id_event"
          class="bg-white/60 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-antique-bronze/20 hover:border-antique-bronze/60 flex flex-col group">
          <!-- Header / Date -->
          <div class="bg-antique-bronze/10 p-4 border-b border-antique-bronze/10 flex justify-between items-center">
            <div class="flex items-center gap-2 text-antique-bronze font-bold">
              <i class="fas fa-clock"></i>
              <span>{{ formatDate(event.start_time) }}</span>
            </div>
            <div class="text-sm font-bold text-stone-500 bg-white/50 px-2 py-1 rounded-sm border border-stone-200">
              {{ event.price }} G
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex-1 flex flex-col">
            <h3
              class="text-xl font-medieval font-bold text-iron-black mb-2 group-hover:text-antique-bronze transition-colors">
              {{ event.title }}
            </h3>
            <p class="text-stone-grey text-sm mb-4 line-clamp-2 flex-1">
              {{ event.description }}
            </p>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex justify-between text-xs font-bold text-stone-500 mb-1">
                <span>Places vendues</span>
                <span>{{ event.sold || 0 }} / {{ event.capacity }}</span>
              </div>
              <div class="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div class="bg-antique-bronze h-full rounded-full transition-all duration-500"
                  :style="{ width: getProgress(event) + '%' }"></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-auto pt-4 border-t border-antique-bronze/10">
              <button @click="viewReservations(event)"
                class="bg-white hover:bg-stone-50 text-emerald-700 border border-emerald-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2"
                :title="t('prestataire.events.table.actions.view_reservations')">
                <i class="fas fa-ticket-alt"></i>
                <span class="hidden xl:inline">{{ event.sold || 0 }}</span>
              </button>
              <button @click="editEvent(event)"
                class="flex-1 bg-white hover:bg-stone-50 text-indigo-700 border border-indigo-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2">
                <i class="fas fa-edit"></i> {{ t('prestataire.events.table.actions.edit') }}
              </button>
              <button @click="deleteEvent(event.id_event)"
                class="bg-white hover:bg-stone-50 text-red-700 border border-red-200 font-bold py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-center gap-2"
                :title="t('prestataire.events.table.actions.delete')">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Create/Edit Modal (Styled) -->
    <div v-if="showModal" class="fixed inset-0 z-[2000] overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true"
          @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-parchment rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-antique-bronze relative z-10"
          @click.stop>
          <div class="bg-parchment px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-6 border-b border-antique-bronze/20 pb-4">
              <h3 class="text-2xl leading-6 font-medieval font-bold text-iron-black" id="modal-title">
                {{ isEditing ? 'Modifier le Décret' : 'Nouveau Décret' }}
              </h3>
              <button @click="closeModal" class="text-stone-grey hover:text-antique-bronze">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <div class="space-y-4 font-body">
              <div>
                <label class="block text-sm font-bold text-iron-black mb-1">{{
                  t('prestataire.events.manager.form.title_label') }}</label>
                <input v-model="form.title" type="text"
                  class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white">
              </div>
              <div>
                <label class="block text-sm font-bold text-iron-black mb-1">{{
                  t('prestataire.events.manager.form.description_label') }}</label>
                <textarea v-model="form.description" rows="3"
                  class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white"></textarea>
              </div>

              <!-- Type Selector -->
              <div class="bg-antique-bronze/5 p-3 rounded-sm border border-antique-bronze/10">
                <span class="block text-sm font-bold text-iron-black mb-2">{{
                  t('prestataire.events.manager.form.type_label') }}</span>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <div class="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" v-model="form.type" value="EVENT"
                        class="peer appearance-none w-5 h-5 border-2 border-antique-bronze rounded-full checked:bg-antique-bronze transition-colors">
                      <i class="fas fa-check text-white text-xs absolute opacity-0 peer-checked:opacity-100"></i>
                    </div>
                    <span class="font-bold text-stone-700 group-hover:text-antique-bronze transition-colors">{{
                      t('prestataire.events.manager.form.type_event') }}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <div class="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" v-model="form.type" value="ACTIVITY"
                        class="peer appearance-none w-5 h-5 border-2 border-antique-bronze rounded-full checked:bg-antique-bronze transition-colors">
                      <i class="fas fa-check text-white text-xs absolute opacity-0 peer-checked:opacity-100"></i>
                    </div>
                    <span class="font-bold text-stone-700 group-hover:text-antique-bronze transition-colors">{{
                      t('prestataire.events.manager.form.type_activity') }}</span>
                  </label>
                </div>
              </div>

              <!-- DATE PICKER (Unified for EVENT and ACTIVITY) -->
              <div class="mb-4" v-if="form.type === 'EVENT' || showSchedulePicker">
                <label class="block text-sm font-bold text-iron-black mb-2">
                  {{ form.type === 'ACTIVITY' ? t('prestataire.events.manager.form.schedules_title') :
                    t('prestataire.events.manager.form.date_label') }}
                </label>

                <!-- Date Navigation -->
                <div
                  class="flex items-center justify-between mb-2 bg-antique-bronze/10 p-2 rounded-sm border border-antique-bronze/20">
                  <button type="button" @click="changeDate(-1)"
                    class="text-antique-bronze hover:text-iron-black font-bold px-2">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <div class="flex items-center gap-2">
                    <input type="date" v-model="selectedDate" :min="settingsStore.festival_start_date || undefined"
                      :max="settingsStore.festival_end_date || undefined"
                      class="bg-transparent border-none font-medieval font-bold text-lg text-center focus:ring-0 cursor-pointer text-iron-black">
                  </div>
                  <button type="button" @click="changeDate(1)"
                    class="text-antique-bronze hover:text-iron-black font-bold px-2">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>

                <!-- Time Grid -->
                <div
                  class="border-2 border-antique-bronze/30 rounded-sm bg-parchment h-56 overflow-y-auto relative custom-scrollbar">
                  <div class="grid grid-cols-1 divide-y divide-antique-bronze/10">
                    <div v-for="hour in 24" :key="hour - 1" @mousedown="startDrag(hour - 1)"
                      @mouseenter="onMouseEnter(hour - 1)"
                      class="flex h-10 hover:bg-antique-bronze/5 cursor-pointer transition-colors relative group"
                      :class="getTimeSlotClass(hour - 1)">
                      <div
                        class="w-16 flex-shrink-0 flex items-center justify-end pr-3 border-r border-antique-bronze/20 text-xs font-bold text-stone-500 select-none">
                        {{ formatHour(hour - 1) }}
                      </div>
                      <div class="flex-grow relative">
                        <!-- Selection Indicator -->
                        <div v-if="isHourSelected(hour - 1)"
                          class="absolute inset-0 bg-antique-bronze/20 border-l-4 border-antique-bronze flex items-center px-2 gap-2">
                          <span class="text-xs font-bold text-antique-bronze" v-if="isStartHour(hour - 1)">{{
                            t('prestataire.events.manager.form.start') }}</span>
                          <span class="text-xs font-bold text-antique-bronze" v-if="isEndHour(hour - 1)">{{
                            t('prestataire.events.manager.form.end') }}</span>
                        </div>
                        <!-- Hover Hint -->
                        <div
                          class="hidden group-hover:flex absolute inset-0 items-center pl-2 text-xs text-stone-400 italic pointer-events-none">
                          {{ isDraggingSelectionStarted ? 'Définir fin' : 'Définir début' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected Time Display -->
                <div class="mt-2 text-sm text-center font-bold text-antique-bronze">
                  <span v-if="currentSelection.start && currentSelection.end">
                    {{ formatDateTime(currentSelection.start) }} - {{ formatResultTime(currentSelection.end) }}
                  </span>
                  <span v-else class="text-stone-400 italic">Sélectionnez une plage horaire</span>
                </div>

                <!-- Manual Inputs (Precision) -->
                <div
                  class="grid grid-cols-2 gap-4 mt-4 border-t border-antique-bronze/10 pt-4 bg-antique-bronze/5 rounded-sm p-3">
                  <div>
                    <label class="block text-xs font-bold text-stone-500 mb-1">Heure de début</label>
                    <input type="time" v-model="selectionStartTime" @change="updateFromTimeInput"
                      class="block w-full border-antique-bronze/30 rounded-sm text-sm focus:ring-antique-bronze bg-white">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-stone-500 mb-1">Heure de fin</label>
                    <input type="time" v-model="selectionEndTime" @change="updateFromTimeInput"
                      class="block w-full border-antique-bronze/30 rounded-sm text-sm focus:ring-antique-bronze bg-white">
                  </div>
                </div>

                <!-- Confirmation Buttons for ACTIVITY -->
                <div v-if="form.type === 'ACTIVITY'"
                  class="flex gap-3 mt-4 justify-end border-t border-antique-bronze/10 pt-4">
                  <button type="button" @click="cancelSchedulePicker"
                    class="text-stone-500 hover:text-stone-700 font-bold text-sm px-3 py-2">
                    Annuler
                  </button>
                  <button type="button" @click="confirmSchedule"
                    :disabled="!currentSelection.start || !currentSelection.end"
                    class="bg-antique-bronze text-white font-bold py-2 px-4 rounded-sm text-sm hover:brightness-110 disabled:opacity-50 transition-all shadow-sm">
                    <i class="fas fa-check mr-2"></i> Valider ce créneau
                  </button>
                </div>
              </div>

              <!-- ACTIVITY SPECIFIC: Add Schedule Button & List -->
              <div v-if="form.type === 'ACTIVITY'" class="mb-4">
                <button v-if="!showSchedulePicker" type="button" @click="openSchedulePicker"
                  class="w-full bg-antique-bronze text-white font-bold py-2.5 rounded-sm text-sm hover:brightness-110 shadow-sm border border-antique-bronze mb-4 flex items-center justify-center gap-2 transition-all">
                  <i class="fas fa-calendar-plus"></i> {{ t('prestataire.events.manager.form.add_schedule') }}
                </button>

                <!-- List of added schedules -->
                <div v-if="form.schedules.length > 0"
                  class="border border-antique-bronze/20 rounded-sm overflow-hidden">
                  <table class="min-w-full divide-y divide-antique-bronze/10 text-sm">
                    <thead class="bg-antique-bronze/10">
                      <tr>
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">Date</th>
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">Heure</th>
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">Cap.</th>
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">Prix</th>
                        <th class="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-antique-bronze/10 bg-white/50">
                      <tr v-for="(sch, idx) in form.schedules" :key="idx">
                        <td class="px-3 py-2">{{ new Date(sch.start_time!).toLocaleDateString() }}</td>
                        <td class="px-3 py-2">
                          {{ new Date(sch.start_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          }} -
                          {{ new Date(sch.end_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </td>
                        <td class="px-3 py-2">
                          <input type="number" v-model="sch.capacity" placeholder="Défaut"
                            class="w-16 text-xs border-stone-300 rounded-sm p-1">
                        </td>
                        <td class="px-3 py-2">
                          <input type="number" v-model="sch.price" placeholder="Défaut"
                            class="w-16 text-xs border-stone-300 rounded-sm p-1">
                        </td>
                        <td class="px-3 py-2 text-right">
                          <button @click="removeSchedule(idx)" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-1">
                    {{ form.type === 'ACTIVITY' ? 'Prix par défaut' : t('prestataire.events.manager.form.price_label')
                    }}
                  </label>
                  <div class="relative">
                    <input v-model.number="form.price" type="number" min="0"
                      class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white pl-8">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-coins text-antique-bronze/50 text-xs"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-1">
                    {{ form.type === 'ACTIVITY' ? 'Capacité par défaut' :
                      t('prestataire.events.manager.form.capacity_label') }}
                  </label>
                  <div class="relative">
                    <input v-model.number="form.capacity" type="number" min="1"
                      class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white pl-8">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-users text-antique-bronze/50 text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-antique-bronze/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-antique-bronze/10">
            <button @click="saveEvent" type="button"
              class="w-full inline-flex justify-center rounded-sm border border-transparent shadow-sm px-4 py-2 bg-antique-bronze text-base font-medium text-white hover:brightness-110 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ isEditing ? t('prestataire.events.manager.form.submit_update') :
                t('prestataire.events.manager.form.submit_create') }}
            </button>
            <button @click="closeModal" type="button"
              class="mt-3 w-full inline-flex justify-center rounded-sm border border-stone-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-stone-700 hover:bg-stone-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ t('prestataire.events.manager.form.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservations Modal -->
    <div v-if="showReservationsModal" class="fixed inset-0 z-[2000] overflow-y-auto" aria-labelledby="modal-title"
      role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true"
          @click="closeReservationsModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-parchment rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border-2 border-antique-bronze relative z-10"
          @click.stop>
          <div class="bg-parchment px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-6 border-b border-antique-bronze/20 pb-4">
              <h3 class="text-2xl leading-6 font-medieval font-bold text-iron-black">
                Réservations : {{ currentReservationEvent?.title }}
              </h3>
              <button @click="closeReservationsModal" class="text-stone-grey hover:text-antique-bronze">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <div v-if="loadingReservations" class="text-center py-8">
              <p class="text-lg font-medieval animate-pulse text-antique-bronze">Recherche des parchemins de
                réservation...</p>
            </div>

            <div v-else-if="currentEventReservations.length === 0"
              class="text-center py-8 bg-white/40 rounded-sm border border-dashed border-antique-bronze/30">
              <i class="fas fa-scroll text-4xl text-antique-bronze/30 mb-3"></i>
              <p class="text-stone-grey">{{ t('events.manager.reservations.empty') }}</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/10">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.adventurer') }}</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.places') }}</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.total') }}</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('events.manager.reservations.headers.date') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white/60 divide-y divide-antique-bronze/10">
                  <tr v-for="reservation in currentEventReservations" :key="reservation.id_reservation"
                    class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="flex-shrink-0 h-8 w-8 rounded-full bg-antique-bronze/20 flex items-center justify-center text-antique-bronze font-bold">
                          {{ reservation.user?.firstname?.charAt(0) || '?' }}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-bold text-iron-black">{{ reservation.user?.firstname }} {{
                            reservation.user?.lastname }}</div>
                          <div class="text-sm text-stone-grey">{{ reservation.user?.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-stone-900 font-bold">{{ reservation.quantity }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-amber-700 font-bold">{{ reservation.total_price }} G</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {{ new Date(reservation.created_at).toLocaleDateString() }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-6 flex justify-end pt-4 border-t border-antique-bronze/10">
              <div class="text-sm text-stone-grey mr-4 flex items-center">
                <span class="font-bold mr-2">Total Réservé:</span>
                {{currentEventReservations.reduce((acc, r) => acc + r.quantity, 0)}} places
              </div>
              <div class="text-sm text-stone-grey flex items-center">
                <span class="font-bold mr-2">Revenu Total:</span>
                <span class="text-green-700 font-bold">{{currentEventReservations.reduce((acc, r) => acc +
                  r.total_price, 0)}} G</span>
              </div>
            </div>

          </div>
          <div
            class="bg-antique-bronze/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-antique-bronze/10">
            <button @click="closeReservationsModal" type="button"
              class="w-full inline-flex justify-center rounded-sm border border-transparent shadow-sm px-4 py-2 bg-antique-bronze text-base font-medium text-white hover:brightness-110 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ t('events.manager.reservations.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore, Event, EventSchedule } from '@/stores/event'
import { locationService } from '@/services/locationService';
import { LocationMock } from '@/mocks/locations';
import { useSettingsStore } from '@/stores/settings';
import { useI18n } from 'vue-i18n';
import BackToMapButton from '@/components/shared/BackToMapButton.vue';

const { t } = useI18n();

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()
const settingsStore = useSettingsStore()

const locationId = Number(route.params.locationId)
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const searchQuery = ref('')

const form = reactive({
  title: '',
  description: '',
  type: 'EVENT' as 'EVENT' | 'ACTIVITY',
  start_time: '',
  end_time: '',
  price: 0,
  capacity: 0,
  schedules: [] as Partial<EventSchedule>[]
})

// Unified Selection State
const currentSelection = reactive({
  start: '',
  end: ''
})

const location = ref<LocationMock | null>(null)

// Reservations Logic
const showReservationsModal = ref(false)
const loadingReservations = ref(false)
const currentEventReservations = ref<any[]>([])
const currentReservationEvent = ref<Event | null>(null)


// Calendar Logic
const selectedDate = ref(new Date().toISOString().split('T')[0])
const isDragging = ref(false)
const dragStartHour = ref<number | null>(null)
const isDraggingSelectionStarted = computed(() => dragStartHour.value !== null)

// Watchers to sync Event data with Selection
watch(() => form.start_time, (newVal) => {
  if (form.type === 'EVENT' && newVal && newVal !== currentSelection.start) {
    currentSelection.start = newVal
    selectedDate.value = newVal.split('T')[0]
  }
})

watch(() => form.end_time, (newVal) => {
  if (form.type === 'EVENT' && newVal && newVal !== currentSelection.end) {
    currentSelection.end = newVal
  }
})

// Clear selection when switching types if needed, or keep for convenience
watch(() => form.type, (newType) => {
  if (newType === 'ACTIVITY') {
    // Optional: clear selection or keep it as draft
    currentSelection.start = ''
    currentSelection.end = ''
  } else {
    // Switching back to EVENT: sync form to selection if exists?
    if (currentSelection.start) form.start_time = currentSelection.start
    if (currentSelection.end) form.end_time = currentSelection.end
  }
})

function changeDate(days: number) {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  const newDateStr = date.toISOString().split('T')[0]

  // Check constraints using Global Settings
  if (settingsStore.festival_start_date && newDateStr < settingsStore.festival_start_date) return
  if (settingsStore.festival_end_date && newDateStr > settingsStore.festival_end_date) return

  selectedDate.value = newDateStr
}

function formatHour(h: number) {
  return `${h.toString().padStart(2, '0')}:00`
}

function formatResultTime(isoString: string) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateTime(isoString: string) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
}

function getHourFromISO(isoString: string) {
  if (!isoString) return -1
  // Ensure we compare dates properly, ignoring time for date check, but checking same day
  if (isoString.split('T')[0] !== selectedDate.value) return -1
  return new Date(isoString).getHours()
}

function isHourSelected(h: number) {
  if (!currentSelection.start) return false
  const start = getHourFromISO(currentSelection.start)
  if (start === -1) return false

  if (!currentSelection.end) return h === start

  const end = getHourFromISO(currentSelection.end)

  if (end !== -1) {
    return h >= start && h < end
  }

  // If end date is > selected date, then all hours after start are selected
  if (currentSelection.end.split('T')[0] > selectedDate.value) {
    return h >= start
  }

  return h === start
}

function isStartHour(h: number) {
  return getHourFromISO(currentSelection.start) === h
}

function isEndHour(h: number) {
  if (!currentSelection.end) return false
  const end = getHourFromISO(currentSelection.end)
  const start = getHourFromISO(currentSelection.start)

  if (end !== -1) {
    return h === end - 1
  }
  if (currentSelection.end.split('T')[0] > selectedDate.value && start !== -1) {
    return h === 23 // Show end on last slot if spanning
  }
  return false
}

function getTimeSlotClass(h: number) {
  if (isHourSelected(h)) {
    return 'bg-emerald-100/50'
  }
  return ''
}

function startDrag(h: number) {
  isDragging.value = true
  dragStartHour.value = h
  updateSelection(h)
}

function onMouseEnter(h: number) {
  if (isDragging.value && dragStartHour.value !== null) {
    updateSelection(h)
  }
}

function stopDrag() {
  if (isDragging.value) {
    isDragging.value = false
    dragStartHour.value = null
  }
}

function updateSelection(currentHour: number) {
  if (dragStartHour.value === null) return

  const start = Math.min(dragStartHour.value, currentHour)
  const end = Math.max(dragStartHour.value, currentHour) + 1 // +1 because end time is exclusive

  const startTime = `${selectedDate.value}T${start.toString().padStart(2, '0')}:00`
  const endTime = `${selectedDate.value}T${end.toString().padStart(2, '0')}:00`

  currentSelection.start = startTime

  if (end === 24) {
    const nextDay = new Date(selectedDate.value)
    nextDay.setDate(nextDay.getDate() + 1)
    currentSelection.end = `${nextDay.toISOString().split('T')[0]}T00:00`
  } else {
    currentSelection.end = endTime
  }

  // Sync to form if EVENT
  if (form.type === 'EVENT') {
    form.start_time = currentSelection.start
    form.end_time = currentSelection.end
  }
}

// Schedule Picker State
const showSchedulePicker = ref(false)
const selectionStartTime = ref('')
const selectionEndTime = ref('')

// Sync manual inputs with currentSelection (e.g. from drag)
watch(() => currentSelection.start, (newVal) => {
  if (newVal) selectionStartTime.value = newVal.split('T')[1].slice(0, 5)
})
watch(() => currentSelection.end, (newVal) => {
  if (newVal) selectionEndTime.value = newVal.split('T')[1].slice(0, 5)
})

function updateFromTimeInput() {
  if (selectionStartTime.value) {
    currentSelection.start = `${selectedDate.value}T${selectionStartTime.value}:00`
  }
  if (selectionEndTime.value) {
    currentSelection.end = `${selectedDate.value}T${selectionEndTime.value}:00`
  }

  // Sync to form if EVENT
  if (form.type === 'EVENT') {
    form.start_time = currentSelection.start
    form.end_time = currentSelection.end
  }
}

function openSchedulePicker() {
  showSchedulePicker.value = true
  currentSelection.start = ''
  currentSelection.end = ''
  selectionStartTime.value = ''
  selectionEndTime.value = ''
}

function confirmSchedule() {
  addScheduleFromSelection()
  showSchedulePicker.value = false
}

function cancelSchedulePicker() {
  showSchedulePicker.value = false
}

// Activity Schedule Logic
function addScheduleFromSelection() {
  if (!currentSelection.start || !currentSelection.end) return;

  form.schedules.push({
    start_time: currentSelection.start,
    end_time: currentSelection.end,
    capacity: form.capacity || undefined, // Use form defaults
    price: form.price || undefined
  });
}

function removeSchedule(index: number) {
  form.schedules.splice(index, 1);
}



async function viewReservations(event: Event) {
  currentReservationEvent.value = event
  showReservationsModal.value = true
  loadingReservations.value = true
  try {
    currentEventReservations.value = await eventStore.fetchEventReservations(event.id_event)
  } catch (e) {
    console.error("Failed to load reservations", e)
    alert("Impossible de charger les réservations.")
  } finally {
    loadingReservations.value = false
  }
}

function closeReservationsModal() {
  showReservationsModal.value = false
  currentEventReservations.value = []
  currentReservationEvent.value = null
}

onMounted(async () => {
  window.addEventListener('mouseup', stopDrag)
  loading.value = true

  try {
    const loc = await locationService.getLocationById(locationId);
    location.value = loc;

    if (settingsStore.festival_start_date) {
      if (selectedDate.value < settingsStore.festival_start_date) {
        selectedDate.value = settingsStore.festival_start_date
      }
    }

    if (loc.status === 'PENDING') {
      alert("Ce lieu est en attente de validation. Vous ne pouvez pas encore gérer ses événements.");
      router.back();
      return;
    }
  } catch (e) {
    console.error("Error checking location status", e);
  }

  await eventStore.fetchEvents({ id_location: locationId })
  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('mouseup', stopDrag)
})

const events = computed(() => eventStore.events.filter(e => e.id_location === locationId))

const filteredEvents = computed(() => {
  if (!searchQuery.value) return events.value
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(e =>
    e.title.toLowerCase().includes(query) ||
    (e.description && e.description.toLowerCase().includes(query))
  )
})

const totalSold = computed(() => events.value.reduce((acc, e) => acc + (e.sold || 0), 0))
const totalRevenue = computed(() => events.value.reduce((acc, e) => acc + ((e.sold || 0) * (e.price || 0)), 0)) // Simplification: uses base price

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Dates multiples';
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

function getProgress(event: Event) {
  if (!event.capacity || event.capacity === 0) return 0
  return ((event.sold || 0) / event.capacity) * 100
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.title = ''
  form.description = ''
  form.type = 'EVENT'
  form.start_time = ''
  form.end_time = ''
  form.price = 0
  form.capacity = 0
  form.schedules = []
  showModal.value = true
}

function editEvent(event: Event) {
  isEditing.value = true
  editingId.value = event.id_event
  form.title = event.title
  form.description = event.description || ''
  form.type = event.type || 'EVENT'

  if (event.start_time) {
    form.start_time = new Date(event.start_time).toISOString().slice(0, 16)
  }
  if (event.end_time) {
    form.end_time = new Date(event.end_time).toISOString().slice(0, 16)
  }

  form.price = event.price || 0
  form.capacity = event.capacity || 0

  if (event.schedules) {
    form.schedules = [...event.schedules]
  } else {
    form.schedules = []
  }

  showModal.value = true
}

async function deleteEvent(id: number) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
    await eventStore.deleteEvent(id)
  }
}

function closeModal() {
  showModal.value = false
}

async function saveEvent() {
  const eventData: any = {
    title: form.title,
    description: form.description,
    type: form.type,
    price: form.price,
    capacity: form.capacity,
    id_location: locationId,
    published: true,
    categories: []
  }

  if (form.type === 'EVENT') {
    if (!form.start_time || !form.end_time) {
      alert("Veuillez définir une date et une heure de début et fin.");
      return;
    }
    eventData.start_time = new Date(form.start_time).toISOString();
    eventData.end_time = new Date(form.end_time).toISOString();
  } else {
    if (!form.schedules || form.schedules.length === 0) {
      alert("Veuillez ajouter au moins un créneau pour cette activité.");
      return;
    }
    eventData.schedules = form.schedules;
  }

  try {
    if (isEditing.value && editingId.value) {
      await eventStore.updateEvent(editingId.value, eventData)
    } else {
      await eventStore.createEvent(eventData)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save event:', error)
    alert('Erreur lors de l\'enregistrement')
  }
}
</script>
