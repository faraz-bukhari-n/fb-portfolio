<script setup lang="ts">
import HeroGlobe from './HeroGlobe.vue'
import { useTheme } from '@/composables/useTheme'
import { TresCanvas } from '@tresjs/core'
import { useEventListener, useMediaQuery } from '@vueuse/core'
import { Vector3 } from 'three'
import { computed, ref } from 'vue'

defineProps<{
  reduced: boolean
}>()

const { resolved } = useTheme()
const pointerX = ref(0)
const pointerY = ref(0)
const compact = useMediaQuery('(max-width: 719px)')
const cameraPos = computed(() =>
  compact.value ? new Vector3(0, 0.12, 4.6) : new Vector3(-0.55, 0.28, 4.2),
)
const clearColor = computed(() => (resolved.value === 'dark' ? '#161410' : '#f3eee6'))

useEventListener(window, 'pointermove', (event: PointerEvent) => {
  pointerX.value = (event.clientX / window.innerWidth) * 2 - 1
  pointerY.value = -(event.clientY / window.innerHeight) * 2 + 1
})
</script>

<template>
  <div class="hero-scene">
    <TresCanvas
      v-if="!reduced"
      :clear-color="clearColor"
      :alpha="false"
      :antialias="true"
      shadows
    >
      <TresPerspectiveCamera :position="cameraPos" :fov="42" />
      <HeroGlobe :pointer-x="pointerX" :pointer-y="pointerY" :reduced="reduced" />
    </TresCanvas>
    <div v-else class="hero-scene__poster" aria-hidden="true" />
  </div>
</template>

<style scoped>
.hero-scene {
  position: absolute;
  inset: 0;
}

@media (min-width: 720px) {
  .hero-scene {
    right: -8%;
  }
}

@media (min-width: 900px) {
  .hero-scene {
    left: 30%;
    right: -4%;
  }
}

.hero-scene :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.hero-scene__poster {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 72% 48%, rgb(var(--ochre-rgb) / 0.28), transparent 42%),
    radial-gradient(circle at 78% 55%, rgb(var(--olive-rgb) / 0.16), transparent 38%),
    var(--bg);
}
</style>
