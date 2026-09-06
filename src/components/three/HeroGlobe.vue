<script setup lang="ts">
import { createHeroGlobe } from './createHeroGlobe'
import { useLoop, useTres } from '@tresjs/core'
import { useMediaQuery } from '@vueuse/core'
import { Color, PointLight, Vector3 } from 'three'
import { onUnmounted, shallowRef, watchEffect } from 'vue'

const props = defineProps<{
  pointerX: number
  pointerY: number
  reduced: boolean
}>()

const globe = createHeroGlobe()
const root = shallowRef(globe.root)
const warmLight = new PointLight(new Color('#f6efe4'), 3.2, 14)
warmLight.position.set(2.4, 1.4, 2.4)
const earthLight = new PointLight(new Color('#a2653d'), 1.6, 12)
earthLight.position.set(-2.2, -0.4, 1.6)
const dirPos = new Vector3(3, 4, 2)

const { camera } = useTres()
const { onBeforeRender, stop, start } = useLoop()

const compact = useMediaQuery('(max-width: 719px)')

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
  globe.root.rotation.y += delta * 0.06
  globe.ring.rotation.z = elapsed * 0.04
  globe.root.rotation.x = Math.sin(elapsed * 0.18) * 0.06
  warmLight.position.x = 2.4 + props.pointerX * 1.2
  warmLight.position.y = 1.4 + props.pointerY * 0.9
  earthLight.position.x = -2.2 + props.pointerX * 0.6
  earthLight.position.y = -0.4 - props.pointerY * 0.7
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVis)
  globe.dispose()
  warmLight.dispose()
  earthLight.dispose()
})
</script>

<template>
  <TresAmbientLight :intensity="0.72" color="#f6efe4" />
  <TresDirectionalLight :position="dirPos" :intensity="1.1" color="#fff6ea" />
  <primitive :object="warmLight" />
  <primitive :object="earthLight" />
  <primitive :object="root" />
</template>
