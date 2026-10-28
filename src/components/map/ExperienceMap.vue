<script setup lang="ts">
import type { ExperienceRole } from '@/content'
import { useTheme, type ResolvedTheme } from '@/composables/useTheme'
import mapboxgl, { type GeoJSONSource, type MapLayerMouseEvent } from 'mapbox-gl'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps<{
  roles: ExperienceRole[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const { resolved } = useTheme()
const host = ref<HTMLDivElement | null>(null)
const token = import.meta.env.VITE_MAPBOX_TOKEN ?? ''
let map: mapboxgl.Map | undefined
let resizeObserver: ResizeObserver | undefined

type LngLat = [number, number]

function chronological(roles: ExperienceRole[]) {
  return [...roles].sort((a, b) => Number(a.start) - Number(b.start))
}

function toRad(degrees: number) {
  return (degrees * Math.PI) / 180
}

function toDeg(radians: number) {
  return (radians * 180) / Math.PI
}

function greatCircle(a: LngLat, b: LngLat, steps = 72): LngLat[] {
  const lat1 = toRad(a[1])
  const lon1 = toRad(a[0])
  const lat2 = toRad(b[1])
  const lon2 = toRad(b[0])
  const d = 2 * Math.asin(
    Math.sqrt(
      Math.sin((lat2 - lat1) / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
    ),
  )
  if (!Number.isFinite(d) || d < 1e-8) return [a, b]
  const points: LngLat[] = []
  for (let i = 0; i <= steps; i += 1) {
    const f = i / steps
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2)
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2)
    const z = A * Math.sin(lat1) + B * Math.sin(lat2)
    points.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))])
  }
  return points
}

function nearlySame(a: LngLat, b: LngLat) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.05
}

function pinCoordinates(roles: ExperienceRole[]): Map<string, LngLat> {
  const groups = new Map<string, ExperienceRole[]>()
  for (const role of roles) {
    const key = `${role.lng.toFixed(3)},${role.lat.toFixed(3)}`
    const group = groups.get(key) ?? []
    group.push(role)
    groups.set(key, group)
  }
  const coords = new Map<string, LngLat>()
  for (const group of groups.values()) {
    group.forEach((role, index) => {
      if (group.length === 1) {
        coords.set(role.id, [role.lng, role.lat])
        return
      }
      const spread = 0.22
      const angle = (Math.PI * 2 * index) / group.length - Math.PI / 4
      coords.set(role.id, [
        role.lng + spread * Math.cos(angle),
        role.lat + spread * Math.sin(angle),
      ])
    })
  }
  return coords
}

function pointCollection() {
  const pins = pinCoordinates(props.roles)
  return {
    type: 'FeatureCollection' as const,
    features: props.roles.map((role) => ({
      type: 'Feature' as const,
      properties: {
        id: role.id,
        label: role.org,
        place: role.location,
        active: role.id === props.activeId ? 1 : 0,
      },
      geometry: { type: 'Point' as const, coordinates: pins.get(role.id) ?? [role.lng, role.lat] },
    })),
  }
}

function pathCollection() {
  const ordered = chronological(props.roles)
  const stops: LngLat[] = []
  for (const role of ordered) {
    const point: LngLat = [role.lng, role.lat]
    const last = stops[stops.length - 1]
    if (!last || !nearlySame(last, point)) stops.push(point)
  }
  const coordinates: LngLat[] = []
  for (let i = 0; i < stops.length - 1; i += 1) {
    const arc = greatCircle(stops[i], stops[i + 1])
    if (coordinates.length) coordinates.pop()
    coordinates.push(...arc)
  }
  return {
    type: 'FeatureCollection' as const,
    features: coordinates.length
      ? [
          {
            type: 'Feature' as const,
            properties: {},
            geometry: { type: 'LineString' as const, coordinates },
          },
        ]
      : [],
  }
}

function syncSources() {
  const instance = map
  if (!instance) return
  ;(instance.getSource('roles') as GeoJSONSource | undefined)?.setData(pointCollection())
  ;(instance.getSource('path') as GeoJSONSource | undefined)?.setData(pathCollection())
}

function fitAll(animate: boolean) {
  const instance = map
  if (!instance || !props.roles.length) return
  const bounds = new mapboxgl.LngLatBounds()
  props.roles.forEach((role) => bounds.extend([role.lng, role.lat]))
  instance.fitBounds(bounds, {
    padding: { top: 72, bottom: 56, left: 56, right: 56 },
    maxZoom: 4.2,
    duration: animate ? 900 : 0,
    essential: true,
  })
}

function flyToActive() {
  const role = props.roles.find((item) => item.id === props.activeId)
  const instance = map
  if (!role || !instance) return
  syncSources()
  instance.flyTo({
    center: [role.lng, role.lat],
    zoom: Math.max(instance.getZoom(), 4.6),
    duration: 1100,
    essential: true,
    curve: 1.35,
  })
}

function onPointClick(event: MapLayerMouseEvent) {
  const feature = event.features?.[0] as { properties?: { id?: unknown } | null } | undefined
  const id = feature?.properties?.id
  if (typeof id === 'string') emit('select', id)
}

function mapStyle(theme: ResolvedTheme) {
  return theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
}

function mapPaint(theme: ResolvedTheme) {
  return theme === 'dark'
    ? {
        glow: '#e8a0b4',
        line: '#5eead4',
        pin: '#e8a0b4',
        idle: '#5eead4',
        stroke: '#140c0f',
        text: '#f6ebef',
        halo: '#140c0f',
      }
    : {
        glow: '#6b1d36',
        line: '#0e7c7b',
        pin: '#6b1d36',
        idle: '#0e7c7b',
        stroke: '#fbf6f3',
        text: '#1c1214',
        halo: '#fbf6f3',
      }
}

function addStoryLayers(instance: mapboxgl.Map) {
  const paint = mapPaint(resolved.value)
  instance.addSource('path', { type: 'geojson', data: pathCollection() })
  instance.addLayer({
    id: 'path-glow',
    type: 'line',
    source: 'path',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': paint.glow,
      'line-width': 6,
      'line-opacity': 0.28,
    },
  })
  instance.addLayer({
    id: 'path-line',
    type: 'line',
    source: 'path',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': paint.line,
      'line-width': 2.2,
      'line-opacity': 0.9,
    },
  })

  instance.addSource('roles', { type: 'geojson', data: pointCollection() })
  instance.addLayer({
    id: 'roles-glow',
    type: 'circle',
    source: 'roles',
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 1], 22, 14],
      'circle-color': paint.pin,
      'circle-opacity': ['case', ['==', ['get', 'active'], 1], 0.32, 0.16],
    },
  })
  instance.addLayer({
    id: 'roles-core',
    type: 'circle',
    source: 'roles',
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 1], 8, 5.5],
      'circle-color': ['case', ['==', ['get', 'active'], 1], paint.pin, paint.idle],
      'circle-stroke-width': 1.6,
      'circle-stroke-color': paint.stroke,
    },
  })
  instance.addLayer({
    id: 'roles-label',
    type: 'symbol',
    source: 'roles',
    layout: {
      'text-field': ['concat', ['get', 'label'], '\n', ['get', 'place']],
      'text-size': 12,
      'text-offset': [0, 1.15],
      'text-anchor': 'top',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
    },
    paint: {
      'text-color': paint.text,
      'text-halo-color': paint.halo,
      'text-halo-width': 1.6,
    },
  })

  bindPinEvents(instance)
}

function onPinEnter() {
  const canvas = map?.getCanvas()
  if (canvas) canvas.style.cursor = 'pointer'
}

function onPinLeave() {
  const canvas = map?.getCanvas()
  if (canvas) canvas.style.cursor = ''
}

function bindPinEvents(instance: mapboxgl.Map) {
  ;(['roles-core', 'roles-glow', 'roles-label'] as const).forEach((layer) => {
    instance.off('click', layer, onPointClick)
    instance.off('mouseenter', layer, onPinEnter)
    instance.off('mouseleave', layer, onPinLeave)
    instance.on('click', layer, onPointClick)
    instance.on('mouseenter', layer, onPinEnter)
    instance.on('mouseleave', layer, onPinLeave)
  })
}

onMounted(() => {
  if (!host.value || !token) return
  mapboxgl.accessToken = token
  const instance = new mapboxgl.Map({
    container: host.value,
    style: mapStyle(resolved.value),
    center: [props.roles[0]?.lng ?? 20, props.roles[0]?.lat ?? 30],
    zoom: 2,
    minZoom: 1.2,
    maxZoom: 10,
    attributionControl: false,
    fadeDuration: 280,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  })
  map = instance
  instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
  instance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

  instance.on('load', () => {
    addStoryLayers(instance)
    fitAll(false)
  })

  resizeObserver = new ResizeObserver(() => instance.resize())
  resizeObserver.observe(host.value)
})

watch(
  () => props.activeId,
  () => flyToActive(),
)

watch(resolved, (theme) => {
  const instance = map
  if (!instance?.isStyleLoaded()) return
  instance.setStyle(mapStyle(theme))
  instance.once('style.load', () => {
    addStoryLayers(instance)
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  map?.remove()
})

</script>

<template>
  <div
    v-if="token"
    ref="host"
    class="experience-map"
    :class="{ 'is-dark': resolved === 'dark' }"
    role="application"
    aria-label="Interactive map of workplaces. Drag to pan, scroll to zoom."
    @wheel.stop
  />
  <div v-else class="experience-map experience-map--fallback">
    <p class="kicker">Mapbox</p>
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
  height: min(58vh, 520px);
  min-height: 320px;
  border: 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-elev);
}

.experience-map--fallback {
  padding: 1.1rem 1.2rem;
  height: auto;
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

.experience-map :deep(.mapboxgl-ctrl-group) {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: none;
  border: 1px solid var(--line);
  background: var(--bg-elev);
}

.experience-map :deep(.mapboxgl-ctrl-group button + button) {
  border-top-color: var(--line);
}

.experience-map :deep(.mapboxgl-ctrl-attrib) {
  font-size: 10px;
  background: rgb(var(--bg-elev-rgb) / 0.82);
}

.experience-map.is-dark :deep(.mapboxgl-ctrl-icon) {
  filter: invert(1) hue-rotate(180deg);
}
</style>
