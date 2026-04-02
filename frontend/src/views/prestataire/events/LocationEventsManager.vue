<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <BackToMapButton to="/prestataire" />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">

      <!-- En-tÃƒÂªte -->
      <div class="mb-8">
        <div class="flex gap-4 mb-6">
          <router-link :to="{ path: '/map', query: { locationId: locationId } }"
            class="inline-flex items-center text-antique-bronze hover:text-dark-wood font-medieval font-bold transition-colors group">
            <i class="fas fa-map-marked-alt mr-2"></i>
            {{ t('prestataire.details.view_on_map') }}
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
            {{ t('prestataire.events.manager.location_id', { id: locationId }) }}
            <span class="mx-3 text-antique-bronze/40">|</span>
            <i class="fas fa-ticket-alt mr-2 text-antique-bronze"></i>
            {{ events.length }} ÃƒÂ©vÃƒÂ©nement(s)
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

      <!-- Barre d'outils (Recherche, Filtres, CrÃƒÂ©ation) -->
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

        <!-- Bouton CrÃƒÂ©er -->
        <button @click="openCreateModal"
          class="w-full md:w-auto bg-antique-bronze hover:brightness-110 text-white font-medieval font-bold py-2.5 px-6 rounded-sm shadow-md transition-all flex items-center justify-center gap-2">
          <i class="fas fa-plus-circle"></i>
          {{ t('prestataire.events.manager.create_button') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-xl font-medieval animate-pulse text-antique-bronze">{{ t('prestataire.events.manager.loading') }}</p>
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
          {{ t('prestataire.events.manager.create_now') }}
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
            <div class="text-stone-grey text-sm mb-4 line-clamp-2 flex-1 description-preview" v-html="event.description"></div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex justify-between text-xs font-bold text-stone-500 mb-1">
                <span>{{ t('prestataire.events.manager.sold_places') }}</span>
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
          class="inline-block align-bottom bg-parchment rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full border-2 border-antique-bronze relative z-10"
          @click.stop>
          <div class="bg-parchment px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-6 border-b border-antique-bronze/20 pb-4">
              <h3 class="text-2xl leading-6 font-medieval font-bold text-iron-black" id="modal-title">
                {{ isEditing ? t('prestataire.events.manager.form.modal_edit_title') : t('prestataire.events.manager.form.modal_create_title') }}
              </h3>
              <button @click="closeModal" class="text-stone-grey hover:text-antique-bronze">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <div class="font-body grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[72vh] overflow-y-auto pr-1">
              <div class="lg:col-start-2">
                <label class="block text-sm font-bold text-iron-black mb-1">{{
                  t('prestataire.events.manager.form.title_label') }}</label>
                <input v-model="form.title" type="text"
                  class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white">
              </div>
              <div class="lg:col-start-2">
                <label class="block text-sm font-bold text-iron-black mb-1">{{
                  t('prestataire.events.manager.form.description_label') }}</label>
                <Editor v-model="form.description" />
              </div>

              <!-- Type Selector -->
              <div class="bg-antique-bronze/5 p-3 rounded-sm border border-antique-bronze/10 lg:col-start-2">
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

              <div class="lg:col-start-2">
                <label class="block text-sm font-bold text-iron-black mb-1">{{ t('prestataire.events.manager.form.category_label') }}</label>
                <select v-model="form.event_category"
                  class="block w-full border-antique-bronze/30 rounded-sm shadow-sm focus:ring-antique-bronze focus:border-antique-bronze bg-white">
                  <option value="">{{ t('prestataire.events.manager.form.category_unspecified') }}</option>
                  <option value="restauration">{{ t('prestataire.events.manager.form.category_options.restauration') }}</option>
                  <option value="atelier">{{ t('prestataire.events.manager.form.category_options.atelier') }}</option>
                  <option value="spectacle">{{ t('prestataire.events.manager.form.category_options.spectacle') }}</option>
                  <option value="marche">{{ t('prestataire.events.manager.form.category_options.marche') }}</option>
                  <option value="concours">{{ t('prestataire.events.manager.form.category_options.concours') }}</option>
                  <option value="autre">{{ t('prestataire.events.manager.form.category_options.autre') }}</option>
                </select>
              </div>

              <!-- DATE PICKER (Unified for EVENT and ACTIVITY) -->
              <div class="mb-4 lg:col-start-1 lg:row-start-1 lg:row-span-6" v-if="form.type === 'EVENT' || showSchedulePicker">
                <label class="block text-sm font-bold text-iron-black mb-2">
                  {{ form.type === 'ACTIVITY' ? t('prestataire.events.manager.form.schedules_title') :
                    t('prestataire.events.manager.form.date_label') }}
                </label>

                <div class="mb-3 bg-antique-bronze/5 rounded-sm border border-antique-bronze/10 p-3" v-if="form.type === 'ACTIVITY'">
                  <label class="block text-xs font-bold text-stone-500 mb-1">{{ t('prestataire.events.manager.form.slot_duration_label') }}</label>
                  <input v-model.number="form.globalDuration" type="number" min="1" step="1" @blur="normalizeGlobalDuration"
                    class="block w-full border-antique-bronze/30 rounded-sm text-sm focus:ring-antique-bronze bg-white">
                  <p class="mt-1 text-[11px] text-stone-500">
                    PrÃ©cision calendrier: {{ formatPrecisionLabel(slotMinutes) }} (Ctrl + molette)
                  </p>
                </div>

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
                  ref="timeGridRef"
                  @wheel="onTimeGridWheel"
                  class="border-2 border-antique-bronze/30 rounded-sm bg-parchment h-[26rem] overflow-y-auto relative custom-scrollbar">
                  <div class="grid grid-cols-1 divide-y divide-antique-bronze/10">
                    <div v-for="slot in displaySlots" :key="slot.slotIndex" @mousedown="startDrag(slot.slotIndex)"
                      @mouseenter="onMouseEnter(slot.slotIndex)"
                      class="flex h-8 hover:bg-antique-bronze/5 cursor-pointer transition-colors relative group"
                      :class="getTimeSlotClass(slot.slotIndex)">
                      <div
                        class="w-16 flex-shrink-0 flex items-center justify-end pr-3 border-r border-antique-bronze/20 text-xs font-bold text-stone-500 select-none">
                        {{ slot.label }}
                      </div>
                      <div class="flex-grow relative">
                        <!-- Selection Indicator -->
                        <div v-if="isSlotSelected(slot.slotIndex)"
                          class="absolute inset-0 bg-antique-bronze/20 border-l-4 border-antique-bronze flex items-center px-2 gap-2">
                          <span class="text-xs font-bold text-antique-bronze" v-if="isStartSlot(slot.slotIndex)">{{
                            t('prestataire.events.manager.form.start') }}</span>
                          <span class="text-xs font-bold text-antique-bronze" v-if="isEndSlot(slot.slotIndex)">{{
                            t('prestataire.events.manager.form.end') }}</span>
                        </div>
                        <!-- Hover Hint -->
                        <div
                          class="hidden group-hover:flex absolute inset-0 items-center pl-2 text-xs text-stone-400 italic pointer-events-none">
                          {{ isDraggingSelectionStarted ? 'DÃƒÂ©finir fin' : 'DÃƒÂ©finir dÃƒÂ©but' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                <!-- Selected Time Display -->
                <div class="mt-2 text-sm text-center font-bold text-antique-bronze"
                  :class="form.type === 'ACTIVITY' ? 'mt-0 bg-white/60 rounded-sm border border-antique-bronze/20 p-3' : ''">
                  <span v-if="currentSelection.start && currentSelection.end">
                    {{ formatDateTime(currentSelection.start) }} - {{ formatResultTime(currentSelection.end) }}
                  </span>
                  <span v-else class="text-stone-400 italic">{{ t('prestataire.events.manager.form.select_time_range') }}</span>
                </div>

                <!-- Manual Inputs (Precision) -->
                <div
                  :class="form.type === 'ACTIVITY' ? 'mt-0' : ''"
                  class="grid grid-cols-2 gap-4 mt-4 border-t border-antique-bronze/10 pt-4 bg-antique-bronze/5 rounded-sm p-3">
                  <div>
                    <label class="block text-xs font-bold text-stone-500 mb-1">{{ t('prestataire.events.manager.form.start_time_label') }}</label>
                    <input type="time" v-model="selectionStartTime" @change="updateFromTimeInput"
                      class="block w-full border-antique-bronze/30 rounded-sm text-sm focus:ring-antique-bronze bg-white">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-stone-500 mb-1">{{ t('prestataire.events.manager.form.end_time_label') }}</label>
                    <input type="time" v-model="selectionEndTime" @change="updateFromTimeInput"
                      class="block w-full border-antique-bronze/30 rounded-sm text-sm focus:ring-antique-bronze bg-white">
                  </div>
                </div>

                <div v-if="form.type === 'ACTIVITY'"
                  class="text-xs font-bold text-stone-500 border-t border-antique-bronze/10 pt-3 flex items-center justify-between gap-2">
                  <span>{{ t('prestataire.events.manager.form.add_selection_hint') }}</span>
                  <div class="flex items-center gap-2">
                    <button type="button" @click="addSelectedSchedules" :disabled="!hasValidSelection()"
                      class="bg-antique-bronze text-white px-3 py-1.5 rounded-sm text-xs font-bold border border-antique-bronze disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all">
                      Ajouter la sÃ©lection
                    </button>
                    <button type="button" @click="showSchedulePicker = false"
                      class="text-antique-bronze hover:text-iron-black font-bold text-xs whitespace-nowrap">
                      Terminer
                    </button>
                  </div>
                </div>
                </div>
              </div>

              <!-- ACTIVITY SPECIFIC: Add Schedule Button & List -->
              <div v-if="form.type === 'ACTIVITY'" class="mb-4 lg:col-start-2">
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
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">{{ t('prestataire.events.manager.form.schedule_table.date') }}</th>
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">{{ t('prestataire.events.manager.form.schedule_table.time') }}</th>
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">{{ t('prestataire.events.manager.form.schedule_table.capacity') }}</th>
                        <th class="px-3 py-2 text-left font-bold text-antique-bronze">{{ t('prestataire.events.manager.form.schedule_table.price') }}</th>
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
                          <input type="number" :value="getScheduleCapacityDisplay(sch)"
                            :placeholder="`DÃ©faut (${form.capacity})`"
                            @input="onScheduleCapacityInput(sch, $event)"
                            class="w-20 text-xs border-stone-300 rounded-sm p-1">
                        </td>
                        <td class="px-3 py-2">
                          <input type="number" :value="getSchedulePriceDisplay(sch)"
                            :placeholder="`DÃ©faut (${form.price})`"
                            @input="onSchedulePriceInput(sch, $event)"
                            class="w-20 text-xs border-stone-300 rounded-sm p-1">
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

              <div class="grid grid-cols-2 gap-4 lg:col-start-2">
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-1">
                    {{ form.type === 'ACTIVITY' ? t('prestataire.events.manager.form.default_price') : t('prestataire.events.manager.form.price_label')
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
                    {{ form.type === 'ACTIVITY' ? 'CapacitÃƒÂ© par dÃƒÂ©faut' :
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
                RÃƒÂ©servations : {{ currentReservationEvent?.title }}
              </h3>
              <button @click="closeReservationsModal" class="text-stone-grey hover:text-antique-bronze">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <div v-if="loadingReservations" class="text-center py-8">
              <p class="text-lg font-medieval animate-pulse text-antique-bronze">Recherche des parchemins de
                rÃƒÂ©servation...</p>
            </div>

            <div v-else-if="currentEventReservations.length === 0"
              class="text-center py-8 bg-white/40 rounded-sm border border-dashed border-antique-bronze/30">
              <i class="fas fa-scroll text-4xl text-antique-bronze/30 mb-3"></i>
              <p class="text-stone-grey">{{ t('prestataire.events.manager.reservations.empty') }}</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/10">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('prestataire.events.manager.reservations.headers.adventurer') }}</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('prestataire.events.manager.reservations.headers.places') }}</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('prestataire.events.manager.reservations.headers.total') }}</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-bold text-antique-bronze uppercase tracking-wider font-medieval">
                      {{ t('prestataire.events.manager.reservations.headers.date') }}</th>
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
                <span class="font-bold mr-2">{{ t('prestataire.events.manager.reservations.total_reserved') }}</span>
                {{currentEventReservations.reduce((acc, r) => acc + r.quantity, 0)}} places
              </div>
              <div class="text-sm text-stone-grey flex items-center">
                <span class="font-bold mr-2">{{ t('prestataire.events.manager.reservations.total_revenue') }}</span>
                <span class="text-green-700 font-bold">{{currentEventReservations.reduce((acc, r) => acc +
                  r.total_price, 0)}} G</span>
              </div>
            </div>

          </div>
          <div
            class="bg-antique-bronze/5 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-antique-bronze/10">
            <button @click="closeReservationsModal" type="button"
              class="w-full inline-flex justify-center rounded-sm border border-transparent shadow-sm px-4 py-2 bg-antique-bronze text-base font-medium text-white hover:brightness-110 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm font-medieval">
              {{ t('prestataire.events.manager.reservations.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, watch, nextTick } from 'vue'
import { stripHtml } from '@/utils/stripHtml'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore, Event, EventSchedule } from '@/stores/event'
import { locationService } from '@/services/locationService';
import { LocationMock } from '@/mocks/locations';
import { useSettingsStore } from '@/stores/settings';
import { useI18n } from 'vue-i18n';
import BackToMapButton from '@/components/shared/BackToMapButton.vue';
import Editor from '@/components/editor/Editor.vue';

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

type LocalSchedule = Partial<EventSchedule> & {
  _capacityInherit?: boolean
  _priceInherit?: boolean
}

const form = reactive({
  title: '',
  description: '',
  type: 'EVENT' as 'EVENT' | 'ACTIVITY',
  event_category: '',
  start_time: '',
  end_time: '',
  price: 0,
  capacity: 0,
  schedules: [] as LocalSchedule[],
  globalDuration: 60
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
const selectedDate = ref(formatDateInputValue(new Date()))
const isDragging = ref(false)
const dragStartSlot = ref<number | null>(null)
const dragCurrentSlot = ref<number | null>(null)
const isDraggingSelectionStarted = computed(() => dragStartSlot.value !== null)
const precisionLevels = [240, 120, 60, 30, 15, 10, 5] as const
const slotMinutes = ref<(typeof precisionLevels)[number]>(15)
const timeGridRef = ref<HTMLElement | null>(null)
const slotsPerDay = computed(() => (24 * 60) / slotMinutes.value)
const displaySlots = computed(() =>
  Array.from({ length: slotsPerDay.value }, (_, slotIndex) => ({
    slotIndex,
    label: formatSlotTime(slotIndex)
  }))
)

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

watch(showModal, (isOpen) => {
  if (isOpen) {
    nextTick(() => scrollTimeGridToWorkingHours())
  }
})

function normalizeGlobalDuration() {
  const normalizedValue = Number(form.globalDuration)
  if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
    form.globalDuration = 60
    return
  }
  form.globalDuration = Math.round(normalizedValue)
}

function changeDate(days: number) {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  const newDateStr = formatDateInputValue(date)

  // Check constraints using Global Settings
  if (settingsStore.festival_start_date && newDateStr < settingsStore.festival_start_date) return
  if (settingsStore.festival_end_date && newDateStr > settingsStore.festival_end_date) return

  selectedDate.value = newDateStr
}

function formatSlotTime(slotIndex: number) {
  const h = Math.floor((slotIndex * slotMinutes.value) / 60)
  const m = (slotIndex * slotMinutes.value) % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function formatPrecisionLabel(minutes: number) {
  if (minutes >= 60) {
    return `${minutes / 60}h`
  }
  return `${minutes} min`
}

function scrollTimeGridToWorkingHours() {
  const timeGrid = timeGridRef.value
  if (!timeGrid) return
  const targetSlotIndex = Math.floor((8 * 60) / slotMinutes.value)
  const rowHeightPx = 32
  timeGrid.scrollTop = targetSlotIndex * rowHeightPx
}

function onTimeGridWheel(event: WheelEvent) {
  if (!event.ctrlKey) return
  event.preventDefault()

  const currentIndex = precisionLevels.indexOf(slotMinutes.value)
  if (currentIndex === -1) return

  const nextIndex = event.deltaY < 0
    ? Math.min(currentIndex + 1, precisionLevels.length - 1)
    : Math.max(currentIndex - 1, 0)

  if (nextIndex !== currentIndex) {
    slotMinutes.value = precisionLevels[nextIndex]
    nextTick(() => scrollTimeGridToWorkingHours())
  }
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toLocalDateTimeInputValue(date: Date) {
  return `${formatDateInputValue(date)}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
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

function getSlotFromISO(isoString: string) {
  if (!isoString) return -1
  if (isoString.split('T')[0] !== selectedDate.value) return -1
  const date = new Date(isoString)
  return Math.floor((date.getHours() * 60 + date.getMinutes()) / slotMinutes.value)
}

function isSlotSelected(slotIndex: number) {
  if (!currentSelection.start) return false
  const start = getSlotFromISO(currentSelection.start)
  if (start === -1) return false

  if (!currentSelection.end) return slotIndex === start

  const end = getSlotFromISO(currentSelection.end)

  if (end !== -1) {
    return slotIndex >= start && slotIndex < end
  }

  if (currentSelection.end.split('T')[0] > selectedDate.value) {
    return slotIndex >= start
  }

  return slotIndex === start
}

function isStartSlot(slotIndex: number) {
  return getSlotFromISO(currentSelection.start) === slotIndex
}

function isEndSlot(slotIndex: number) {
  if (!currentSelection.end) return false
  const end = getSlotFromISO(currentSelection.end)
  const start = getSlotFromISO(currentSelection.start)

  if (end !== -1) {
    return slotIndex === end - 1
  }
  if (currentSelection.end.split('T')[0] > selectedDate.value && start !== -1) {
    return slotIndex === slotsPerDay.value - 1
  }
  return false
}

function getTimeSlotClass(slotIndex: number) {
  if (isSlotSelected(slotIndex)) {
    return 'bg-emerald-100/50'
  }
  return ''
}

function startDrag(slotIndex: number) {
  isDragging.value = true
  dragStartSlot.value = slotIndex
  dragCurrentSlot.value = slotIndex
  updateSelection(slotIndex)
}

function onMouseEnter(slotIndex: number) {
  if (isDragging.value && dragStartSlot.value !== null) {
    dragCurrentSlot.value = slotIndex
    updateSelection(slotIndex)
  }
}

function stopDrag() {
  if (isDragging.value) {
    const isClickSelection = dragStartSlot.value !== null && dragCurrentSlot.value !== null && dragStartSlot.value === dragCurrentSlot.value
    if (isClickSelection && currentSelection.start) {
      const startSlot = getSlotFromISO(currentSelection.start)
      if (startSlot >= 0) {
        setSelectionFromStartAndDuration(startSlot, form.globalDuration)
      }
    }

    isDragging.value = false
    dragStartSlot.value = null
    dragCurrentSlot.value = null

  }
}

function updateSelection(currentSlot: number) {
  if (dragStartSlot.value === null) return

  const start = Math.min(dragStartSlot.value, currentSlot)
  const end = Math.max(dragStartSlot.value, currentSlot) + 1
  currentSelection.start = `${selectedDate.value}T${formatSlotTime(start)}`

  if (end >= slotsPerDay.value) {
    const nextDay = new Date(selectedDate.value)
    nextDay.setDate(nextDay.getDate() + 1)
    currentSelection.end = `${formatDateInputValue(nextDay)}T00:00`
  } else {
    currentSelection.end = `${selectedDate.value}T${formatSlotTime(end)}`
  }

  // Sync to form if EVENT
  if (form.type === 'EVENT') {
    form.start_time = currentSelection.start
    form.end_time = currentSelection.end
  }
}

function setSelectionFromSlots(startSlot: number, endSlotExclusive: number) {
  const normalizedStart = Math.max(0, Math.min(startSlot, slotsPerDay.value - 1))
  const normalizedEnd = Math.max(normalizedStart + 1, endSlotExclusive)
  currentSelection.start = `${selectedDate.value}T${formatSlotTime(normalizedStart)}`
  if (normalizedEnd >= slotsPerDay.value) {
    const nextDay = new Date(selectedDate.value)
    nextDay.setDate(nextDay.getDate() + 1)
    currentSelection.end = `${formatDateInputValue(nextDay)}T00:00`
  } else {
    currentSelection.end = `${selectedDate.value}T${formatSlotTime(normalizedEnd)}`
  }

  if (form.type === 'EVENT') {
    form.start_time = currentSelection.start
    form.end_time = currentSelection.end
  }
}

function setSelectionFromStartAndDuration(startSlot: number, durationMinutesRaw: number) {
  const durationMinutes = Math.max(1, Math.round(Number(durationMinutesRaw) || 0))
  const [year, month, day] = selectedDate.value.split('-').map(Number)
  const startMinutesOfDay = startSlot * slotMinutes.value
  const startHour = Math.floor(startMinutesOfDay / 60)
  const startMinute = startMinutesOfDay % 60
  const startDate = new Date(year, (month || 1) - 1, day || 1, startHour, startMinute, 0, 0)
  const endDate = new Date(startDate.getTime() + durationMinutes * 60_000)

  currentSelection.start = toLocalDateTimeInputValue(startDate)
  currentSelection.end = toLocalDateTimeInputValue(endDate)

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
  const parseTimeToSlot = (timeValue: string) => {
    const [hoursRaw, minutesRaw] = timeValue.split(':')
    const hours = Number(hoursRaw || 0)
    const minutes = Number(minutesRaw || 0)
    return Math.floor((hours * 60 + minutes) / slotMinutes.value)
  }

  let startSlot = -1
  let endSlot = -1
  if (selectionStartTime.value) {
    startSlot = parseTimeToSlot(selectionStartTime.value)
    currentSelection.start = `${selectedDate.value}T${formatSlotTime(startSlot)}`
  }
  if (selectionEndTime.value) {
    endSlot = parseTimeToSlot(selectionEndTime.value)
    currentSelection.end = `${selectedDate.value}T${formatSlotTime(endSlot)}`
  }

  if (startSlot >= 0 && endSlot >= 0 && endSlot <= startSlot) {
    setSelectionFromStartAndDuration(startSlot, form.globalDuration)
  }

  // Sync to form if EVENT
  if (form.type === 'EVENT') {
    form.start_time = currentSelection.start
    form.end_time = currentSelection.end
  }
}

function openSchedulePicker() {
  showSchedulePicker.value = true
  const schedulesSorted = [...form.schedules]
    .filter(s => s.start_time && s.end_time)
    .sort((a, b) => new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime())

  if (schedulesSorted.length > 0) {
    const lastSchedule = schedulesSorted[schedulesSorted.length - 1]
    if (lastSchedule.end_time) {
      const startDate = new Date(lastSchedule.end_time)
      if (!Number.isNaN(startDate.getTime())) {
        selectedDate.value = formatDateInputValue(startDate)
        currentSelection.start = toLocalDateTimeInputValue(startDate)
        const endDate = new Date(startDate.getTime() + (form.globalDuration * 60_000))
        currentSelection.end = toLocalDateTimeInputValue(endDate)
        return
      }
    }
  }

  currentSelection.start = ''
  currentSelection.end = ''
  selectionStartTime.value = ''
  selectionEndTime.value = ''
  nextTick(() => scrollTimeGridToWorkingHours())
}

// Activity Schedule Logic
function addScheduleFromSelection() {
  normalizeGlobalDuration()

  if (!currentSelection.start || !currentSelection.end) return

  const startDate = new Date(currentSelection.start)
  const endDate = new Date(currentSelection.end)
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) return

  const chunkDurationMs = form.globalDuration * 60_000
  let cursorMs = startDate.getTime()
  const endMs = endDate.getTime()

  while (cursorMs < endMs) {
    const nextMs = Math.min(cursorMs + chunkDurationMs, endMs)
    const nextSchedule = {
      start_time: toLocalDateTimeInputValue(new Date(cursorMs)),
      end_time: toLocalDateTimeInputValue(new Date(nextMs)),
      capacity: undefined,
      price: undefined,
      _capacityInherit: true,
      _priceInherit: true
    } as LocalSchedule

    const duplicateExists = form.schedules.some(existing =>
      existing.start_time === nextSchedule.start_time &&
      existing.end_time === nextSchedule.end_time
    )

    if (!duplicateExists) {
      form.schedules.push(nextSchedule)
    }

    cursorMs = nextMs
  }

  form.schedules.sort((a, b) => {
    const aTime = a.start_time ? new Date(a.start_time).getTime() : 0
    const bTime = b.start_time ? new Date(b.start_time).getTime() : 0
    return aTime - bTime
  })

  const nextStart = new Date(endMs)
  const nextEnd = new Date(endMs + chunkDurationMs)
  currentSelection.start = toLocalDateTimeInputValue(nextStart)
  currentSelection.end = toLocalDateTimeInputValue(nextEnd)
}

function hasValidSelection() {
  if (!currentSelection.start || !currentSelection.end) return false
  const startDate = new Date(currentSelection.start)
  const endDate = new Date(currentSelection.end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return false
  return startDate < endDate
}

function addSelectedSchedules() {
  if (!hasValidSelection()) return
  addScheduleFromSelection()
}

function isInheritCapacity(schedule: LocalSchedule) {
  return schedule._capacityInherit !== false
}

function isInheritPrice(schedule: LocalSchedule) {
  return schedule._priceInherit !== false
}

function getScheduleCapacityDisplay(schedule: LocalSchedule) {
  return isInheritCapacity(schedule) ? '' : (schedule.capacity ?? '')
}

function getSchedulePriceDisplay(schedule: LocalSchedule) {
  return isInheritPrice(schedule) ? '' : (schedule.price ?? '')
}

function onScheduleCapacityInput(schedule: LocalSchedule, eventObj: globalThis.Event) {
  const rawValue = (eventObj.target as HTMLInputElement)?.value ?? ''
  if (rawValue === '') {
    schedule.capacity = undefined
    schedule._capacityInherit = true
    return
  }
  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed <= 0) return
  schedule.capacity = parsed
  schedule._capacityInherit = false
}

function onSchedulePriceInput(schedule: LocalSchedule, eventObj: globalThis.Event) {
  const rawValue = (eventObj.target as HTMLInputElement)?.value ?? ''
  if (rawValue === '') {
    schedule.price = undefined
    schedule._priceInherit = true
    return
  }
  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed < 0) return
  schedule.price = parsed
  schedule._priceInherit = false
}

function toSchedulePayload(schedule: LocalSchedule): Partial<EventSchedule> {
  return {
    id_schedule: schedule.id_schedule,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    capacity: isInheritCapacity(schedule) ? undefined : schedule.capacity,
    price: isInheritPrice(schedule) ? undefined : schedule.price
  }
}

function removeSchedule(index: number) {
  form.schedules.splice(index, 1)
}



async function viewReservations(event: Event) {
  currentReservationEvent.value = event
  showReservationsModal.value = true
  loadingReservations.value = true
  try {
    currentEventReservations.value = await eventStore.fetchEventReservations(event.id_event)
  } catch (e) {
    console.error("Failed to load reservations", e)
    alert(t('prestataire.events.manager.errors.load_reservations'))
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
      alert(t('prestataire.events.manager.errors.location_pending'));
      router.back();
      return;
    }
  } catch (e) {
    console.error("Error checking location status", e);
  }

  await eventStore.fetchEvents({ id_location: locationId })
  loading.value = false
  nextTick(() => scrollTimeGridToWorkingHours())
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
  if (!dateStr) return t('events.list.dates_multiples');
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
  form.event_category = ''
  form.start_time = ''
  form.end_time = ''
  form.price = 0
  form.capacity = 0
  form.schedules = []
  form.globalDuration = 60
  showModal.value = true
}

function editEvent(event: Event) {
  isEditing.value = true
  editingId.value = event.id_event
  form.title = event.title
  form.description = event.description || ''
  form.type = event.type || 'EVENT'
  form.event_category = event.event_category || ''

  if (event.start_time) {
    form.start_time = toLocalDateTimeInputValue(new Date(event.start_time))
  }
  if (event.end_time) {
    form.end_time = toLocalDateTimeInputValue(new Date(event.end_time))
  }

  form.price = event.price || 0
  form.capacity = event.capacity || 0

  if (event.schedules) {
    form.schedules = event.schedules.map((schedule) => {
      const numericCapacity = schedule.capacity === undefined ? undefined : Number(schedule.capacity)
      const numericPrice = schedule.price === undefined ? undefined : Number(schedule.price)
      const capacityInherit = numericCapacity === undefined || numericCapacity === form.capacity
      const priceInherit = numericPrice === undefined || numericPrice === form.price

      return {
        ...schedule,
        capacity: capacityInherit ? undefined : numericCapacity,
        price: priceInherit ? undefined : numericPrice,
        _capacityInherit: capacityInherit,
        _priceInherit: priceInherit
      }
    })
  } else {
    form.schedules = []
  }

  showModal.value = true
}

async function deleteEvent(id: number) {
  if (confirm(t('prestataire.events.manager.confirm.delete_event'))) {
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
    event_category: form.event_category || undefined,
    price: form.price,
    capacity: form.capacity,
    id_location: locationId,
    published: true,
    categories: []
  }

  if (form.type === 'EVENT') {
    if (!form.start_time || !form.end_time) {
      alert(t('prestataire.events.manager.errors.missing_start_end'));
      return;
    }
    eventData.start_time = new Date(form.start_time).toISOString();
    eventData.end_time = new Date(form.end_time).toISOString();
  } else {
    if (!form.schedules || form.schedules.length === 0) {
      alert(t('prestataire.events.manager.errors.missing_schedule'));
      return;
    }
    eventData.schedules = form.schedules.map(toSchedulePayload);
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
    alert(t('prestataire.events.manager.errors.save'))
  }
}
</script>



