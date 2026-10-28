<script setup lang="ts">
import HeroGlobe, { type GlobeSpin } from './HeroGlobe.vue'
import { useTheme } from '@/composables/useTheme'
import { TresCanvas } from '@tresjs/core'
import { useMediaQuery } from '@vueuse/core'
import { Vector3 } from 'three'
import { computed, reactive, ref } from 'vue'

const props = defineProps<{
  reduced: boolean
}>()

const { resolved } = useTheme()
const compact = useMediaQuery('(max-width: 719px)')
const cameraPos = computed(() =>
  compact.value ? new Vector3(0, 0.12, 4.6) : new Vector3(-0.55, 0.28, 4.2),
)
const clearColor = computed(() => (resolved.value === 'dark' ? '#140c0f' : '#fbf6f3'))
const spin = reactive<GlobeSpin>({
  y: 0,
  x: 0,
  vy: 0,
  vx: 0,
  dragging: false,
})

const host = ref<HTMLDivElement | null>(null)
let lastX = 0
let lastY = 0
let startX = 0
let startY = 0
let pressed = false
let mode: 'undecided' | 'globe' | 'scroll' = 'undecided'
const DRAG_THRESHOLD = 8

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  pressed = true
  mode = event.pointerType === 'mouse' ? 'globe' : 'undecided'
  spin.dragging = mode === 'globe'
  spin.vy = 0
  spin.vx = 0
  lastX = startX = event.clientX
  lastY = startY = event.clientY
  if (mode === 'globe') {
    try {
      host.value?.setPointerCapture(event.pointerId)
    } catch {
      /* untrusted or unsupported capture */
    }
  }
}

function onPointerMove(event: PointerEvent) {
  if (!pressed || event.buttons === 0) return
  if (mode === 'scroll') return
  if (mode === 'undecided') {
    const ax = Math.abs(event.clientX - startX)
    const ay = Math.abs(event.clientY - startY)
    if (ax < DRAG_THRESHOLD && ay < DRAG_THRESHOLD) return
    if (ay > ax) {
      mode = 'scroll'
      return
    }
    mode = 'globe'
    spin.dragging = true
    try {
      host.value?.setPointerCapture(event.pointerId)
    } catch {
      /* untrusted or unsupported capture */
    }
  }
  if (mode !== 'globe') return
  event.preventDefault()
  const dx = event.clientX - lastX
  const dy = event.clientY - lastY
  lastX = event.clientX
  lastY = event.clientY
  spin.y += dx * 0.0055
  spin.x = Math.min(0.82, Math.max(-0.82, spin.x + dy * 0.0042))
  spin.vy = dx * 0.0055
  spin.vx = dy * 0.0042
}

function onPointerUp(event: PointerEvent) {
  try {
    if (host.value?.hasPointerCapture(event.pointerId)) {
      host.value.releasePointerCapture(event.pointerId)
    }
  } catch {
    /* already released */
  }
  pressed = false
  spin.dragging = false
  mode = 'undecided'
}
</script>

<template>
  <div
    ref="host"
    class="hero-scene"
    :class="{ 'is-dragging': spin.dragging, 'is-live': !props.reduced }"
    role="img"
    aria-label="Interactive globe. Drag to rotate."
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @lostpointercapture="onPointerUp"
  >
    <TresCanvas
      v-if="!reduced"
      :clear-color="clearColor"
      :alpha="false"
      :antialias="true"
      shadows
    >
      <TresPerspectiveCamera :position="cameraPos" :fov="42" />
      <HeroGlobe :reduced="reduced" :spin="spin" />
    </TresCanvas>
    <div v-else class="hero-scene__poster" aria-hidden="true" />
  </div>
</template>

<style scoped>
.hero-scene {
  position: absolute;
  inset: 0;
  z-index: 1;
  touch-action: pan-y;
  user-select: none;
}

.hero-scene.is-live {
  cursor: grab;
}

.hero-scene.is-dragging {
  cursor: grabbing;
  touch-action: none;
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
    radial-gradient(circle at 72% 48%, rgb(var(--cyan-rgb) / 0.22), transparent 42%),
    radial-gradient(circle at 78% 55%, rgb(var(--olive-rgb) / 0.16), transparent 38%),
    var(--bg);
}
</style>
