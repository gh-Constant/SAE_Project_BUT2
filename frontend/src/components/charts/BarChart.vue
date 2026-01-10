<template>
  <div class="w-full flex flex-col items-center">
    <div class="relative w-full" :style="{ height: `${height}px` }">
      <svg class="w-full h-full" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
        <!-- Bars -->
        <g v-for="(item, index) in normalizedData" :key="index">
          <!-- Bar -->
          <rect
            :x="item.x"
            :y="item.y"
            :width="barWidth"
            :height="item.height"
            :fill="color"
            class="transition-all duration-300 hover:opacity-80"
            rx="4"
          >
            <title>{{ item.label }}: {{ item.value }}</title>
          </rect>
          <!-- Value Label -->
          <text
            :x="item.x + barWidth / 2"
            :y="item.y - 5"
            text-anchor="middle"
            class="text-xs font-bold fill-current text-iron-black"
            style="font-size: 10px;"
          >
            {{ item.shortValue || item.value }}
          </text>
          <!-- Axis Label -->
          <text
            :x="item.x + barWidth / 2"
            :y="height - 5"
            text-anchor="middle"
            class="text-xs text-stone-grey"
            style="font-size: 10px;"
          >
            {{ item.label }}
          </text>
        </g>
      </svg>
    </div>
    <div v-if="title" class="mt-2 text-sm font-bold text-stone-grey uppercase tracking-wider">
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ChartItem {
  label: string;
  value: number;
}

const props = withDefaults(defineProps<{
  data: ChartItem[];
  height?: number;
  width?: number;
  color?: string;
  title?: string;
}>(), {
  height: 200,
  width: 500,
  color: '#8B4513',
  title: ''
});

const barWidth = computed(() => {
  const gap = 10;
  const availableWidth = props.width - (props.data.length * gap);
  return Math.max(10, availableWidth / props.data.length);
});

const normalizedData = computed(() => {
  const max = Math.max(...props.data.map(d => d.value), 1);
  const bottomPadding = 20;
  const topPadding = 20;
  const chartHeight = props.height - bottomPadding - topPadding;
  const gap = (props.width - (props.data.length * barWidth.value)) / (props.data.length + 1);

  return props.data.map((item, index) => {
    const barHeight = (item.value / max) * chartHeight;
    return {
      ...item,
      height: barHeight,
      x: gap + (index * (barWidth.value + gap)),
      y: props.height - bottomPadding - barHeight,
      shortValue: item.value > 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value
    };
  });
});
</script>
