<template>
  <div class="flex flex-col items-center">
    <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :viewBox="`0 0 ${size} ${size}`" class="transform -rotate-90 w-full h-full">
        <!-- Segments -->
        <circle
          v-for="(segment, index) in segments"
          :key="index"
          :cx="center"
          :cy="center"
          :r="radius"
          :fill="donut ? 'transparent' : 'none'"
          :stroke="segment.color"
          :stroke-width="donut ? strokeWidth : radius * 2"
          :stroke-dasharray="segment.dashArray"
          :stroke-dashoffset="segment.dashOffset"
          class="transition-all duration-300 hover:opacity-90"
          @mouseenter="activeSegment = index"
          @mouseleave="activeSegment = null"
        >
          <title>{{ segment.label }}: {{ segment.percentage }}% ({{ segment.count }})</title>
        </circle>
        
        <!-- Center Text (Donut only) -->
        <foreignObject v-if="donut" :x="center - centerTextWidth/2" :y="center - centerTextWidth/2" :width="centerTextWidth" :height="centerTextWidth">
          <div class="h-full flex flex-col items-center justify-center text-center">
             <slot name="center-text">
               <span v-if="activeSegment !== null" class="text-2xl font-bold font-medieval text-iron-black">
                 {{ segments[activeSegment].percentage }}%
               </span>
               <span v-if="activeSegment !== null" class="text-xs text-stone-grey truncate max-w-full px-2">
                 {{ segments[activeSegment].label }}
               </span>
             </slot>
          </div>
        </foreignObject>
      </svg>
    </div>
    
    <!-- Legend -->
    <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm" v-if="showLegend">
      <div 
        v-for="(segment, index) in segments" 
        :key="index"
        class="flex items-center gap-2 cursor-pointer transition-opacity"
        :class="{ 'opacity-50': activeSegment !== null && activeSegment !== index }"
        @mouseenter="activeSegment = index"
        @mouseleave="activeSegment = null"
      >
        <div class="w-3 h-3 rounded-full shadow-sm" :style="{ backgroundColor: segment.color }"></div>
        <span class="text-iron-black font-medium">{{ segment.label }}</span>
        <span class="text-stone-grey/70 text-xs">({{ segment.percentage }}%)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface ChartData {
  label: string;
  count: number;
  color: string;
  percentage?: number; // Optional if you want to pass pre-calculated
}

const props = withDefaults(defineProps<{
  data: ChartData[];
  size?: number;
  donut?: boolean;
  strokeWidth?: number;
  showLegend?: boolean;
}>(), {
  size: 200,
  donut: true,
  strokeWidth: 20,
  showLegend: true
});

const center = computed(() => props.size / 2);
const radius = computed(() => props.donut ? (props.size - props.strokeWidth) / 2 : props.size / 4);
const circumference = computed(() => 2 * Math.PI * radius.value);
const centerTextWidth = computed(() => (radius.value * 2) - 10); // Slightly smaller than inner diameter

const activeSegment = ref<number | null>(null);

const segments = computed(() => {
  let accumulatedPercentage = 0;
  const total = props.data.reduce((sum, item) => sum + item.count, 0);

  return props.data.map((item) => {
    // Calculate percentage if not provided, or ensure it's accurate
    const percentage = item.percentage ?? Math.round((item.count / total) * 100);
    
    // Stroke dasharray calculation
    // The trick for SVG circle charts: dasharray = "lengthOfArc circumference"
    // But for solid pie, we use stroke-width = radius*2.
    // However, cleaner way for both is using stroke-dasharray.
    
    // Length of the segment on the circumference
    const segmentLength = (percentage / 100) * circumference.value;
    const gap = circumference.value - segmentLength;
    
    const dashArray = `${segmentLength} ${gap}`;
    
    // Offset is sum of previous lengths
    const offset = (accumulatedPercentage / 100) * circumference.value;
    // SVG circles start at 3 o'clock. -90deg rotation in CSS puts it at 12 o'clock.
    // stroke-dashoffset needs to be negative to go clockwise
    const dashOffset = -offset;

    accumulatedPercentage += percentage;

    return {
      ...item,
      percentage,
      dashArray,
      dashOffset
    };
  });
});

</script>
