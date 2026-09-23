<script setup lang="ts">
import CareerTimeline from '@/components/viz/CareerTimeline.vue'
import PageFrame from '@/components/ui/PageFrame.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { experience } from '@/content'
import { defineAsyncComponent, ref } from 'vue'

const ExperienceMap = defineAsyncComponent(() => import('@/components/map/ExperienceMap.vue'))

usePageTitle('Experience')
const activeId = ref(experience[0]?.id ?? '')
</script>

<template>
  <PageFrame wide>
    <TerminalHeading index="02" kicker="log">Experience</TerminalHeading>
    <div class="experience-grid">
      <CareerTimeline :roles="experience" :active-id="activeId" @select="activeId = $event" />
      <div class="experience-grid__map">
        <p class="kicker">geo · workplaces</p>
        <p class="map-hint">Drag to pan · scroll to zoom · click a pin</p>
        <ExperienceMap :roles="experience" :active-id="activeId" @select="activeId = $event" />
      </div>
    </div>
  </PageFrame>
</template>

<style scoped>
.experience-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
  min-width: 0;
}

.experience-grid__map {
  order: -1;
  min-width: 0;
}

.experience-grid__map .kicker {
  margin: 0 0 0.35rem;
}

.map-hint {
  margin: 0 0 0.7rem;
  color: var(--muted);
  font-size: 0.82rem;
}

@media (min-width: 900px) {
  .experience-grid {
    grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
    gap: 2rem;
  }

  .experience-grid__map {
    order: 0;
    position: sticky;
    top: calc(var(--nav-h) + 1.2rem);
  }
}
</style>
