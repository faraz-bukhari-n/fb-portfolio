<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const route = useRoute()
const reduced = usePrefersReducedMotion()
const active = ref(false)

watch(
  () => route.fullPath,
  () => {
    if (reduced.value) return
    active.value = true
    window.setTimeout(() => {
      active.value = false
    }, 620)
  },
)
</script>

<template>
  <div class="route-wipe" :class="{ 'route-wipe--on': active }" aria-hidden="true" />
</template>

<style scoped>
.route-wipe {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 80;
  opacity: 0;
  background: var(--bg);
}

.route-wipe--on {
  animation: veil 0.62s var(--ease) forwards;
}

@keyframes veil {
  0% {
    opacity: 0;
  }
  35% {
    opacity: 0.55;
  }
  100% {
    opacity: 0;
  }
}
</style>
