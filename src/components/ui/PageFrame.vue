<script setup lang="ts">
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { gsap } from 'gsap'
import { onMounted, useTemplateRef } from 'vue'

defineProps<{
  wide?: boolean
}>()

const root = useTemplateRef<HTMLElement>('root')
const reduced = usePrefersReducedMotion()

onMounted(() => {
  if (reduced.value || !root.value) return
  const items = root.value.querySelectorAll(':scope > *')
  gsap.from(items, {
    y: 22,
    opacity: 0,
    duration: 0.85,
    stagger: 0.07,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div class="page-pad page-grid">
    <div ref="root" :class="['page-shell', { 'page-shell--wide': wide }]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.page-shell--wide {
  width: 100%;
  max-width: 1280px;
  min-width: 0;
}
</style>
