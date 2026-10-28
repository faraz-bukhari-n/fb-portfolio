<script setup lang="ts">
import { createHeroGlobe } from './createHeroGlobe'
import { useTheme } from '@/composables/useTheme'
import { useLoop, useTres } from '@tresjs/core'
import { useMediaQuery } from '@vueuse/core'
import { Color, PointLight, Vector3 } from 'three'
import { computed, onUnmounted, shallowRef, watch, watchEffect } from 'vue'

export type GlobeSpin = {
  y: number
  x: number
  vy: number
  vx: number
  dragging: boolean
}

const props = defineProps<{
  reduced: boolean
  spin: GlobeSpin
}>()

const { resolved } = useTheme()
const globe = createHeroGlobe()
const root = shallowRef(globe.root)
const warmLight = new PointLight(new Color('#f6ebef'), 3.2, 14)
warmLight.position.set(2.4, 1.4, 2.4)
const earthLight = new PointLight(new Color('#8b2e4a'), 1.6, 12)
earthLight.position.set(-2.2, -0.4, 1.6)
const dirPos = new Vector3(3, 4, 2)
const ambientColor = computed(() => (resolved.value === 'dark' ? '#1e1216' : '#f6ebef'))
const ambientIntensity = computed(() => (resolved.value === 'dark' ? 0.42 : 0.72))
const dirColor = computed(() => (resolved.value === 'dark' ? '#e8eef6' : '#ffffff'))
const dirIntensity = computed(() => (resolved.value === 'dark' ? 0.7 : 1.1))

const { camera, renderer } = useTres()
const { onBeforeRender, stop, start } = useLoop()

const compact = useMediaQuery('(max-width: 719px)')

watch(
  resolved,
  (theme) => {
    globe.applyTheme(theme)
    renderer?.setClearColor(theme === 'dark' ? '#140c0f' : '#fbf6f3')
    if (theme === 'dark') {
      warmLight.color.set('#5eead4')
      warmLight.intensity = 1.7
      earthLight.color.set('#e8a0b4')
      earthLight.intensity = 1.15
    } else {
      warmLight.color.set('#f6ebef')
      warmLight.intensity = 3.2
      earthLight.color.set('#0e7c7b')
      earthLight.intensity = 1.6
    }
  },
  { immediate: true },
)

watchEffect(() => {
  const x = compact.value ? 0 : 1.35
  globe.root.position.set(x, compact.value ? -0.18 : -0.08, 0)
  camera.value?.lookAt(x, 0, 0)
})

const onVis = () => {
  if (document.hidden) stop()
  else start()
}
document.addEventListener('visibilitychange', onVis)

onBeforeRender(({ delta, elapsed }) => {
  if (props.reduced) return

  const spin = props.spin
  if (!spin.dragging) {
    const damp = Math.exp(-3.6 * delta)
    spin.vy *= damp
    spin.vx *= damp
    if (Math.abs(spin.vy) < 0.002) {
      spin.y += delta * 0.06
      spin.vy = 0
    } else {
      spin.y += spin.vy
    }
    if (Math.abs(spin.vx) < 0.002) {
      const idle = Math.sin(elapsed * 0.18) * 0.06
      spin.x += (idle - spin.x) * (1 - Math.exp(-2.4 * delta))
      spin.vx = 0
    } else {
      spin.x = Math.min(0.82, Math.max(-0.82, spin.x + spin.vx))
    }
  }

  globe.root.rotation.y = spin.y
  globe.root.rotation.x = spin.x
  globe.ring.rotation.z = elapsed * 0.04
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVis)
  globe.dispose()
  warmLight.dispose()
  earthLight.dispose()
})
</script>

<template>
  <TresAmbientLight :intensity="ambientIntensity" :color="ambientColor" />
  <TresDirectionalLight :position="dirPos" :intensity="dirIntensity" :color="dirColor" />
  <primitive :object="warmLight" />
  <primitive :object="earthLight" />
  <primitive :object="root" />
</template>
