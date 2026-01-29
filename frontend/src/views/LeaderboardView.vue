<script setup lang="ts">
/**
 * @file LeaderboardView.vue
 * @description
 * Page de classement global des aventuriers.
 * Affiche un tableau paginé des utilisateurs avec leur rang, niveau et XP.
 * L'utilisateur connecté reste toujours visible (soit dans la liste, soit en sticky footer).
 */

import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { userService } from '@/services/userService';
import MedievalSectionTitle from '@/components/ui/MedievalSectionTitle.vue';

const auth = useAuthStore();
const leaderboard = ref<any[]>([]);
const totalUsers = ref(0);
const currentPage = ref(1);
const limit = 10;
const loading = ref(false);

const headers = [
    { key: 'rank', label: 'Rang' },
    { key: 'name', label: 'Aventurier' },
    { key: 'level', label: 'Niveau' },
    { key: 'xp', label: 'XP Total' },
];

const loadLeaderboard = async (page: number) => {
    loading.value = true;
    try {
        const response = await userService.getLeaderboard(page, limit);
        if (response) { // Check if response exists (mock returns Response object, but service might return undefined if error handled poorly)
            const data = await response.json();
            leaderboard.value = data.users;
            totalUsers.value = data.total;
            currentPage.value = data.page;
        }
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
    } finally {
        loading.value = false;
    }
};

const totalPages = computed(() => Math.ceil(totalUsers.value / limit));

const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        loadLeaderboard(newPage);
    }
};

// Check if current user is in the visible list
const isCurrentUserVisible = computed(() => {
    if (!auth.user) return false;
    return leaderboard.value.some(u => u.id === auth.user?.id);
});

// Get user rank (cached in store or could be fetched)
// Note: auth.user.rank should be up to date thanks to our previous optimizations
const userRank = computed(() => auth.user?.rank || '-');

onMounted(() => {
    loadLeaderboard(1);
});
</script>

<template>
    <div class="min-h-screen bg-parchment pt-28 pb-24">
        <div class="max-w-4xl mx-auto px-4">
            <div class="text-center mb-10">
                <MedievalSectionTitle>{{ 'Le Grand Grimoire des Aventuriers' }}</MedievalSectionTitle>
                <p class="text-stone-grey font-body mt-2">Qui sont les plus braves héros du royaume ?</p>
            </div>

            <div
                class="bg-parchment rounded-lg shadow-2xl border-4 border-double border-antique-bronze overflow-hidden relative">
                <!-- Decorative corner flourishes -->
                <div
                    class="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-antique-bronze/40 rounded-tl-lg pointer-events-none">
                </div>
                <div
                    class="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-antique-bronze/40 rounded-tr-lg pointer-events-none">
                </div>
                <div
                    class="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-antique-bronze/40 rounded-bl-lg pointer-events-none">
                </div>
                <div
                    class="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-antique-bronze/40 rounded-br-lg pointer-events-none">
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="p-20 text-center">
                    <i class="fas fa-circle-notch fa-spin text-4xl text-antique-bronze mb-4"></i>
                    <div class="text-stone-grey font-medieval text-xl">Consultation des archives royales...</div>
                </div>

                <!-- Ranking Table -->
                <table v-else class="w-full text-left">
                    <thead
                        class="bg-antique-bronze/10 text-dark-wood font-medieval uppercase text-sm tracking-wider border-b-2 border-antique-bronze/30">
                        <tr>
                            <th class="p-5 w-20 text-center">Rang</th>
                            <th class="p-5">Aventurier</th>
                            <th class="p-5 w-32 text-center">Niveau</th>
                            <th class="p-5 w-40 text-right">XP</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-antique-bronze/20 font-body">
                        <tr v-for="user in leaderboard" :key="user.id"
                            class="hover:bg-antique-bronze/5 transition-colors group"
                            :class="{ 'bg-gold/10': auth.user && user.id === auth.user.id }">
                            <td class="p-4 text-center font-bold text-dark-wood">
                                <div v-if="user.rank <= 3"
                                    class="flex items-center justify-center w-10 h-10 mx-auto rounded-full shadow-sm"
                                    :class="user.rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' :
                                        user.rank === 2 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-400' :
                                            'bg-orange-100 text-orange-800 ring-2 ring-orange-400'">
                                    <span class="text-xl">{{ user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                                    }}</span>
                                </div>
                                <span v-else class="font-medieval text-lg text-stone-grey/80 font-bold">#{{ user.rank
                                }}</span>
                            </td>
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <!-- Avatar small -->
                                    <div
                                        class="w-10 h-10 rounded-full border border-antique-bronze/50 overflow-hidden bg-warm-sand shadow-sm">
                                        <img v-if="user.avatar_url" :src="user.avatar_url"
                                            class="w-full h-full object-cover" alt="Avatar">
                                        <div v-else
                                            class="w-full h-full flex items-center justify-center bg-antique-bronze/20 text-antique-bronze">
                                            <i class="fas fa-user"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold text-dark-wood font-medieval text-lg leading-tight">
                                            {{ user.firstname }} {{ user.lastname }}
                                            <span v-if="auth.user && user.id === auth.user.id"
                                                class="ml-2 px-2 py-0.5 rounded-full bg-gold/20 text-dark-wood text-[10px] font-bold uppercase tracking-wide border border-gold/40">
                                                Vous
                                            </span>
                                        </div>
                                        <div class="text-xs text-stone-500 italic">{{ user.bio ? user.bio.substring(0,
                                            30) +
                                            (user.bio.length > 30 ? '...' : '') : 'Aventurier mystérieux' }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4 text-center">
                                <span
                                    class="inline-block px-3 py-1 rounded-full bg-antique-bronze/10 text-dark-wood font-bold border border-antique-bronze/20 shadow-sm text-sm">
                                    Lvl {{ user.level }}
                                </span>
                            </td>
                            <td class="p-4 text-right">
                                <span class="font-bold text-dark-wood/80">{{ user.xp.toLocaleString() }}</span>
                                <span class="text-xs text-stone-500 uppercase ml-1">xp</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Empty State -->
                <div v-if="!loading && leaderboard.length === 0"
                    class="p-16 text-center text-stone-grey italic font-medieval text-lg">
                    <i class="fas fa-scroll text-4xl mb-4 text-antique-bronze/40"></i>
                    <p>Aucun aventurier n'a encore bravé ces terres.</p>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-6 mt-8">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="group flex items-center gap-2 px-5 py-2 bg-parchment border-2 border-antique-bronze rounded-lg text-dark-wood hover:bg-antique-bronze hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-parchment disabled:hover:text-dark-wood transition-all duration-300 font-medieval shadow-md">
                    <i class="fas fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
                    <span>Précédent</span>
                </button>

                <span
                    class="font-medieval text-dark-wood text-lg px-4 py-2 bg-white/50 rounded border border-stone-200 shadow-inner">
                    Page <span class="font-bold text-antique-bronze">{{ currentPage }}</span> <span
                        class="text-sm text-stone-400">/ {{ totalPages }}</span>
                </span>

                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="group flex items-center gap-2 px-5 py-2 bg-parchment border-2 border-antique-bronze rounded-lg text-dark-wood hover:bg-antique-bronze hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-parchment disabled:hover:text-dark-wood transition-all duration-300 font-medieval shadow-md">
                    <span>Suivant</span>
                    <i class="fas fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>

            <!-- Sticky User Stats (if not visible) -->
            <transition enter-active-class="transform transition ease-out duration-300"
                enter-from-class="translate-y-full opacity-0" enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transform transition ease-in duration-200"
                leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
                <div v-if="auth.user && !isCurrentUserVisible && !loading"
                    class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-dark-wood text-parchment rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 border-gold/50 p-4 flex items-center justify-between z-50 overflow-hidden ring-4 ring-black/20">
                    <!-- Background decoration -->
                    <div class="absolute inset-0 opacity-10 bg-[url('/images/noise.png')] pointer-events-none"></div>
                    <div class="absolute -left-4 -top-4 w-20 h-20 bg-gold/20 rounded-full blur-2xl"></div>

                    <div class="flex items-center gap-5 relative z-10 transition-transform hover:scale-105">
                        <div class="relative">
                            <div
                                class="bg-gradient-to-br from-gold to-amber-600 text-dark-wood font-bold rounded-full w-14 h-14 flex items-center justify-center border-4 border-dark-wood shadow-lg">
                                <span class="font-medieval text-xl">#{{ userRank }}</span>
                            </div>
                            <div
                                class="absolute -bottom-1 -right-1 bg-dark-wood text-gold text-[10px] px-1.5 py-0.5 rounded border border-gold/30 uppercase font-bold">
                                Rang</div>
                        </div>
                        <div class="flex flex-col">
                            <span class="font-medieval font-bold text-xl leading-none text-gold drop-shadow-sm">Votre
                                Position</span>
                            <span class="text-xs text-stone-300/80 mt-1">Continuez vos efforts, aventurier !</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-8 relative z-10">
                        <div class="text-center group cursor-default">
                            <div
                                class="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-0.5 group-hover:text-gold transition-colors">
                                Niveau</div>
                            <div
                                class="font-medieval text-2xl text-parchment group-hover:scale-110 transition-transform">
                                {{
                                    auth.user.level }}</div>
                        </div>
                        <div class="w-px h-10 bg-white/10"></div>
                        <div class="text-center group cursor-default">
                            <div
                                class="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-0.5 group-hover:text-gold transition-colors">
                                XP Total</div>
                            <div
                                class="font-medieval text-2xl text-parchment group-hover:scale-110 transition-transform">
                                {{
                                    auth.user.xp.toLocaleString() }}</div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
