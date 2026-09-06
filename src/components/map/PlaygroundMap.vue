<script setup lang="ts">
import {
  careerArcs,
  columns,
  heatmapPoints,
  hexPoints,
  scatterPoints,
  trips,
} from '@/content/playground-data'
import type { BasemapId, LayerId } from '@/content/playground-layers'
import * as Cesium from 'cesium'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  active: Record<LayerId, boolean>
  time: number
  basemap: BasemapId
}>()

const host = ref<HTMLDivElement | null>(null)
const tooltip = ref<{ x: number; y: number; text: string } | null>(null)

let viewer: Cesium.Viewer | undefined
const groups: Record<LayerId, Cesium.Entity[]> = {
  personal: [],
  arcs: [],
  hex: [],
  heat: [],
  columns: [],
  trips: [],
  scatter: [],
}

function cssColor(hex: string, alpha = 1) {
  return Cesium.Color.fromCssColorString(hex)!.withAlpha(alpha)
}

function imageryFor(id: Exclude<BasemapId, 'blank'>): Cesium.ImageryProvider {
  if (id === 'satellite') {
    return new Cesium.UrlTemplateImageryProvider({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      credit: 'Tiles © Esri',
    })
  }
  if (id === 'terrain') {
    return new Cesium.OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/',
    })
  }
  return new Cesium.UrlTemplateImageryProvider({
    url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
    credit: 'CARTO, OSM',
  })
}

function setBasemap(id: BasemapId) {
  if (!viewer) return
  viewer.imageryLayers.removeAll()
  if (id !== 'blank') {
    viewer.imageryLayers.addImageryProvider(imageryFor(id))
  }
  viewer.scene.globe.baseColor = id === 'blank' ? cssColor('#d9cfc0') : cssColor('#9db6c6')
  viewer.scene.globe.enableLighting = id !== 'paper'
}

function applyVisibility() {
  ;(Object.keys(groups) as LayerId[]).forEach((id) => {
    groups[id].forEach((entity) => {
      entity.show = props.active[id]
    })
  })
}

function rgb(color: [number, number, number], alpha = 1) {
  return new Cesium.Color(color[0] / 255, color[1] / 255, color[2] / 255, alpha)
}

function tripPositions(time: number, trip: (typeof trips)[number]) {
  const pts: number[] = []
  trip.path.forEach((pair, index) => {
    if (trip.timestamps[index] <= time) {
      pts.push(pair[0], pair[1])
    }
  })
  if (pts.length < 4) return undefined
  return Cesium.Cartesian3.fromDegreesArray(pts)
}

function buildEntities() {
  if (!viewer) return
  const { entities } = viewer

  scatterPoints.forEach((point) => {
    const entity = entities.add({
      name: point.name,
      position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat),
      point: {
        pixelSize: point.kind === 'project' ? 11 : 8,
        color: rgb(point.color),
        outlineColor: cssColor('#fbf8f2'),
        outlineWidth: 1.5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })
    groups.personal.push(entity)
  })

  careerArcs.forEach((arc) => {
    const entity = entities.add({
      name: arc.name,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          arc.source[0],
          arc.source[1],
          180000,
          arc.target[0],
          arc.target[1],
          180000,
        ]),
        width: 2,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.18,
          color: cssColor('#a2653d', 0.85),
        }),
        arcType: Cesium.ArcType.GEODESIC,
      },
    })
    groups.arcs.push(entity)
  })

  hexPoints
    .filter((_, index) => index % 18 === 0)
    .forEach((point, index) => {
      const height = 40000 + point.weight * 18000
      const entity = entities.add({
        name: 'Cluster',
        position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, height / 2),
        box: {
          dimensions: new Cesium.Cartesian3(28000, 28000, height),
          material: cssColor(index % 2 ? '#4f5d43' : '#a2653d', 0.55),
        },
      })
      groups.hex.push(entity)
    })

  heatmapPoints
    .filter((_, index) => index % 14 === 0)
    .forEach((point) => {
      const entity = entities.add({
        name: 'Heat',
        position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat),
        ellipse: {
          semiMinorAxis: 50000 + point.weight * 12000,
          semiMajorAxis: 50000 + point.weight * 12000,
          material: cssColor('#a2653d', 0.12),
          height: 0,
        },
      })
      groups.heat.push(entity)
    })

  columns.forEach((column) => {
    const height = column.value * 4000
    const entity = entities.add({
      name: column.name,
      position: Cesium.Cartesian3.fromDegrees(column.lng, column.lat, height / 2),
      box: {
        dimensions: new Cesium.Cartesian3(42000, 42000, height),
        material: cssColor('#4f5d43', 0.78),
      },
    })
    groups.columns.push(entity)
  })

  hexPoints
    .filter((_, index) => index % 22 === 0)
    .forEach((point) => {
      const entity = entities.add({
        position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat),
        point: {
          pixelSize: 4,
          color: cssColor('#4f5d43', 0.55),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      })
      groups.scatter.push(entity)
    })

  trips.forEach((trip) => {
    const entity = entities.add({
      name: trip.name,
      polyline: {
        positions: tripPositions(props.time, trip) ?? [],
        width: 3,
        material: rgb(trip.color, 0.9),
        arcType: Cesium.ArcType.GEODESIC,
      },
    })
    groups.trips.push(entity)
  })
}

function updateTrips() {
  groups.trips.forEach((entity, index) => {
    const trip = trips[index]
    const positions = tripPositions(props.time, trip)
    if (entity.polyline && positions) {
      entity.polyline.positions = new Cesium.ConstantProperty(positions)
    }
  })
}

onMounted(() => {
  if (!host.value) return
  const ion = import.meta.env.VITE_CESIUM_TOKEN
  if (ion) Cesium.Ion.defaultAccessToken = ion

  viewer = new Cesium.Viewer(host.value, {
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    baseLayer: new Cesium.ImageryLayer(
      imageryFor(props.basemap === 'blank' ? 'paper' : props.basemap),
    ),
  })
  viewer.scene.globe.enableLighting = false
  if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true
  viewer.scene.fog.enabled = true
  viewer.scene.backgroundColor = cssColor('#f3eee6')
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(12, 28, 16_000_000),
    duration: 1.8,
  })

  viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
    if (!viewer) return
    const picked = viewer.scene.pick(movement.endPosition)
    const entity = picked?.id as Cesium.Entity | undefined
    if (entity?.name) {
      tooltip.value = {
        x: movement.endPosition.x,
        y: movement.endPosition.y,
        text: entity.name,
      }
    } else {
      tooltip.value = null
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  buildEntities()
  applyVisibility()
})

watch(
  () => props.active,
  () => applyVisibility(),
  { deep: true },
)

watch(
  () => props.time,
  () => updateTrips(),
)

watch(
  () => props.basemap,
  (id) => setBasemap(id),
)

onUnmounted(() => {
  viewer?.destroy()
  viewer = undefined
})
</script>

<template>
  <div class="playground-map">
    <div ref="host" class="playground-map__canvas" />
    <div
      v-if="tooltip"
      class="playground-map__tip"
      :style="{ left: `${tooltip.x + 12}px`, top: `${tooltip.y + 12}px` }"
    >
      {{ tooltip.text }}
    </div>
  </div>
</template>

<style scoped>
.playground-map {
  position: absolute;
  inset: 0;
}

.playground-map__canvas {
  position: absolute;
  inset: 0;
}

.playground-map__canvas :deep(.cesium-viewer),
.playground-map__canvas :deep(.cesium-widget),
.playground-map__canvas :deep(canvas) {
  width: 100%;
  height: 100%;
}

.playground-map__canvas :deep(.cesium-viewer-bottom) {
  left: auto;
  right: 12px;
  bottom: 8px;
}

.playground-map__tip {
  position: absolute;
  z-index: 4;
  pointer-events: none;
  background: var(--bg-elev);
  border: 1px solid var(--line);
  color: var(--text);
  font-size: 0.8rem;
  padding: 0.4rem 0.55rem;
  border-radius: 8px;
  box-shadow: var(--glow-cyan);
}
</style>
