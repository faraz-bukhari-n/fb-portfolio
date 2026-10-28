<script setup lang="ts">
import HudNav from './HudNav.vue'
import RouteWipe from './RouteWipe.vue'
import SectionRail from './SectionRail.vue'
import SiteFooter from './SiteFooter.vue'
import { useLenis } from '@/composables/useLenis'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const fullBleed = computed(() => Boolean(route.meta.fullBleed))

useLenis(() => !fullBleed.value)
</script>

<template>
  <HudNav />
  <SectionRail />
  <RouteWipe />
  <main :class="{ 'is-full-bleed': fullBleed }">
    <slot />
  </main>
  <SiteFooter :compact="fullBleed" />
</template>

<style scoped>
main:not(.is-full-bleed) {
  min-height: 100svh;
}
</style>
