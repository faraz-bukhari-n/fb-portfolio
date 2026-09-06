<script setup lang="ts">
import type { ExperienceRole } from '@/content'
import mapboxgl, { type GeoJSONSource } from 'mapbox-gl'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps<{
  roles: ExperienceRole[]
  activeId: string
}>()

const host = ref<HTMLDivElement | null>(null)
const token = import.meta.env.VITE_MAPBOX_TOKEN ?? ''
let map: mapboxgl.Map | undefined

function featureCollection() {
  return {
    type: 'FeatureCollection' as const,
    features: props.roles.map((role) => ({
      type: 'Feature' as const,
      properties: { id: role.id, label: role.org, active: role.id === props.activeId },
      geometry: { type: 'Point' as const, coordinates: [role.lng, role.lat] },
    })),
  }
}

function flyToActive() {
  const role = props.roles.find((item) => item.id === props.activeId)
  const instance = map
  if (!role || !instance) return
  instance.flyTo({
    center: [role.lng, role.lat],
    zoom: 4.4,
    duration: 1400,
    essential: true,
    curve: 1.4,
  })
  const source = instance.getSource('roles') as GeoJSONSource | undefined
  source?.setData(featureCollection())
}

onMounted(() => {
  if (!host.value || !token) return
  mapboxgl.accessToken = token
  const instance = new mapboxgl.Map({
    container: host.value,
    style: 'mapbox://styles/mapbox/light-v11',
    center: [props.roles[0]?.lng ?? 0, props.roles[0]?.lat ?? 20],
    zoom: 2.2,
    attributionControl: false,
    interactive: false,
    fadeDuration: 400,
  })
  map = instance
  instance.on('load', () => {
    instance.addSource('roles', { type: 'geojson', data: featureCollection() })
    instance.addLayer({
      id: 'roles-glow',
      type: 'circle',
      source: 'roles',
      paint: {
        'circle-radius': 14,
        'circle-color': '#a2653d',
        'circle-opacity': 0.18,
      },
    })
    instance.addLayer({
      id: 'roles-core',
      type: 'circle',
      source: 'roles',
      paint: {
        'circle-radius': 5,
        'circle-color': '#4f5d43',
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#fbf8f2',
      },
    })
    flyToActive()
  })
})

watch(
  () => props.activeId,
  () => flyToActive(),
)

onUnmounted(() => {
  map?.remove()
})
</script>

<template>
  <div v-if="token" ref="host" class="experience-map" role="img" aria-label="Map of workplaces" />
  <div v-else class="experience-map experience-map--fallback">
    <p class="kicker">Mapbox</p>
    <!-- <p>Add <code>VITE_MAPBOX_TOKEN</code> in <code>.env.local</code> to show the workplace map.</p> -->
    <ul>
      <li v-for="role in roles" :key="role.id" :class="{ 'is-on': role.id === activeId }">
        {{ role.org }} · {{ role.location }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.experience-map {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-elev);
}

.experience-map--fallback {
  padding: 1.1rem 1.2rem;
}

.experience-map--fallback p {
  margin: 0.35rem 0 0.9rem;
  color: var(--muted);
  line-height: 1.55;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 0.35rem 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
}

li.is-on {
  color: var(--earth);
}
</style>
