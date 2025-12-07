<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { productService } from '@/services/productService';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const emit = defineEmits(['close']);

const items = computed(() => cartStore.items);
const total = computed(() => cartStore.total);

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  locationId?: number;
}

interface CartItem {
  id_product: number;
  product?: Product;
}

const getProduct = (item: CartItem): Product | undefined => {
  if (item.product) {
    return item.product;
  }
  const allProducts = productService.getProductsForBoutique();
  return allProducts.find((p) => p.id === item.id_product);
};

const viewCart = () => {
  emit('close');
  router.push('/panier');
};

const checkout = () => {
  emit('close');
  router.push('/checkout'); // Or whatever the checkout route is, likely handled in CartView usually but we can go there if items exist
  // Actually CartView handles the checkout process (creating orders). 
  // Maybe just go to /panier for now to avoid duplicating checkout logic or go to /panier with a query param?
  // Let's just go to /panier for "Checkout" too or make it trigger the checkout flow if possible.
  // For now, "Passer la commande" will just go to /panier as the user needs to review it there usually.
  router.push('/panier');
};

const removeItem = (id: number) => {
  cartStore.removeFromCart(id);
};
</script>

<template>
  <div class="absolute left-0 mt-2 w-[450px] bg-parchment border-2 border-antique-bronze shadow-[0_4px_8px_rgba(0,0,0,0.4)] rounded-sm py-4 z-50 transform origin-top-left transition-all duration-200">
    <!-- Decorative Corner (optional, keeping it simple for now) -->
    
    <!-- Header -->
    <div class="px-6 pb-3 border-b-2 border-antique-bronze/20 flex justify-between items-center">
      <h3 class="font-medieval text-iron-black text-xl tracking-wide">{{ $t('cart.title') }}</h3>
      <span class="font-body text-xs font-medium text-parchment bg-antique-bronze px-2 py-1 rounded-sm shadow-sm">
        {{ $t('cart.items_count', { count: cartStore.itemCount }) }}
      </span>
    </div>

    <!-- Items List -->
    <div class="max-h-80 overflow-y-auto custom-scrollbar">
      <div v-if="items.length === 0" class="px-6 py-10 text-center">
        <div class="w-16 h-16 bg-antique-bronze/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-antique-bronze/20">
          <i class="fas fa-scroll text-antique-bronze text-2xl"></i>
        </div>
        <p class="font-medieval text-stone-grey text-lg">{{ $t('cart.empty_title') }}</p>
      </div>

      <div v-else class="divide-y divide-antique-bronze/10">
        <div v-for="item in items" :key="item.id_product" class="px-6 py-4 hover:bg-antique-bronze/5 transition-colors group">
          <div class="flex gap-4">
            <!-- Image -->
            <div class="w-20 h-20 rounded-sm bg-warm-sand overflow-hidden flex-shrink-0 border border-antique-bronze/30 shadow-inner">
              <img 
                v-if="getProduct(item)?.image" 
                :src="getProduct(item)?.image" 
                :alt="getProduct(item)?.name"
                class="w-full h-full object-cover sepia-[.25]"
              >
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <h4 class="font-medieval text-iron-black text-lg truncate pr-4 leading-tight">
                  {{ getProduct(item)?.name || $t('cart.unknown_product') }}
                </h4>
                <p class="font-body text-sm text-stone-grey mt-1">
                  {{ item.quantity }} x {{ $t('cart.price_format', { price: item.price.toFixed(2) }) }}
                </p>
              </div>
              <div class="flex justify-between items-end">
                <span class="font-medieval text-antique-bronze text-lg">
                  {{ $t('cart.price_format', { price: (item.price * item.quantity).toFixed(2) }) }}
                </span>
                <button 
                  @click.stop="removeItem(item.id_product)"
                  class="text-stone-grey hover:text-red-700 transition-colors p-1 opacity-0 group-hover:opacity-100"
                  :title="$t('cart.remove_tooltip')"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="items.length > 0" class="px-6 pt-4 border-t-2 border-antique-bronze/20 bg-antique-bronze/5">
      <div class="flex justify-between items-center mb-5">
        <span class="font-medieval text-stone-grey text-lg">{{ $t('cart.total') }}</span>
        <span class="font-medieval text-iron-black text-2xl">{{ $t('cart.price_format', { price: total.toFixed(2) }) }}</span>
      </div>
      
      <div class="space-y-3">
        <button
          @click="viewCart"
          class="w-full py-3 bg-dark-wood hover:bg-black text-parchment font-medieval text-lg rounded-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 border border-antique-bronze/50"
        >
          <span>{{ $t('cart.view_cart') }}</span>
          <i class="fas fa-scroll text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(193, 155, 108, 0.1); /* antique-bronze/10 */
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #C19B6C; /* antique-bronze */
  border-radius: 3px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #A08055;
}
</style>
