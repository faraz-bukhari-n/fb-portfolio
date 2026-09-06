<script setup lang="ts">
import LayerDock from '@/components/map/LayerDock.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import TimeSlider from '@/components/map/TimeSlider.vue'
import GlowButton from '@/components/ui/GlowButton.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { tripDuration } from '@/content/playground-data'
import type { BasemapId, LayerId } from '@/content/playground-layers'
import { defineAsyncComponent, onMounted, onUnmounted, reactive, ref } from 'vue'

const PlaygroundMap = defineAsyncComponent(() => import('@/components/map/PlaygroundMap.vue'))

usePageTitle('Playground')
const reduced = usePrefersReducedMotion()

const active = reactive<Record<LayerId, boolean>>({
  personal: true,
  arcs: true,
  hex: true,
  heat: false,
  columns: true,
  trips: true,
  scatter: false,
})

const time = ref(0)
const basemap = ref<BasemapId>('paper')
const playing = ref(true)
let raf = 0
let last = 0

function toggle(id: LayerId) {
  active[id] = !active[id]
}

function tick(now: number) {
  if (!last) last = now
  const delta = (now - last) / 1000
  last = now
  if (playing.value && !reduced.value && active.trips) {
    time.value = (time.value + delta) % tripDuration
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section class="playground">
    <PlaygroundMap :active="active" :time="time" :basemap="basemap" />
    <div class="playground__hud">
      <div class="playground__top">
        <div>
          <p class="kicker">webgis lab</p>
          <h1>Playground</h1>
        </div>
        <GlowButton to="/" variant="ghost">Home</GlowButton>
      </div>
      <LayerDock :active="active" @toggle="toggle" />
    </div>
    <div class="playground__bottom">
      <TimeSlider v-model="time" :max="tripDuration" />
      <MapLegend v-model="basemap" />
    </div>
  </section>
</template>

<style scoped>
.playground {
  position: relative;
  min-height: 100svh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

.playground__hud,
.playground__bottom {
  position: relative;
  z-index: 3;
  width: auto;
  margin: 0 var(--page-pad);
  display: grid;
  gap: 0.8rem;
}

.playground__hud {
  padding-top: calc(var(--nav-h) + 0.8rem);
}

.playground__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

h1 {
  margin: 0.2rem 0 0;
  font-size: clamp(1.5rem, 6vw, 1.8rem);
  letter-spacing: -0.04em;
}

.playground__bottom {
  padding-bottom: 1.2rem;
  gap: 0.7rem;
}

.playground :deep(.playground-map) {
  position: relative;
  min-height: 52vh;
}

@media (min-width: 720px) {
  .playground {
    display: block;
  }

  .playground__hud {
    position: absolute;
    top: calc(var(--nav-h) + 0.8rem);
    left: var(--page-pad);
    width: min(340px, calc(100% - 2 * var(--page-pad)));
    margin: 0;
    padding-top: 0;
  }

  .playground__bottom {
    position: absolute;
    right: var(--page-pad);
    bottom: 1.2rem;
    width: min(360px, calc(100% - 2 * var(--page-pad)));
    margin: 0;
    padding-bottom: 0;
  }

  .playground :deep(.playground-map) {
    position: absolute;
    inset: 0;
    min-height: 0;
  }
}
</style>
