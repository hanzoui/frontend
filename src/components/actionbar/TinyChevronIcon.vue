<template>
  <svg
    :class="rotateUp && 'rotate-180'"
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M0.650391 0.649902L3.65039 3.6499L6.65039 0.649902"
      stroke="#8A8A8A"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
const { rotateUp = false } = defineProps<{
  rotateUp?: boolean
}>()
</script>
