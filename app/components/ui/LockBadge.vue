<script setup lang="ts">
const props = defineProps<{
  isVisible: boolean
  isOpen: boolean
}>()
</script>

<template>
  <div
    v-if="props.isVisible"
    class="mx-auto mb-3 w-fit rounded-full border border-stone-300 bg-white px-4 py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
  >
    <svg
      class="h-7 w-7 text-stone-700"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 11V8.5C7 5.46 9.46 3 12.5 3C15.54 3 18 5.46 18 8.5V11"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
      />
      <rect
        x="5"
        y="10"
        width="15"
        height="11"
        rx="2.4"
        stroke="currentColor"
        stroke-width="1.7"
        :class="props.isOpen ? 'translate-y-[2px] opacity-70' : ''"
        class="origin-center"
      />
      <circle
        cx="12.5"
        cy="15.5"
        r="1.4"
        fill="currentColor"
        :class="props.isOpen ? 'opacity-40' : 'opacity-90'"
      />
    </svg>
  </div>
</template>
