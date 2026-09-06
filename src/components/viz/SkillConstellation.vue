<script setup lang="ts">
import { skillGroupColor, skills, type Skill } from '@/content'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
  zoomIdentity,
} from 'd3'
import type { D3ZoomEvent, SimulationLinkDatum, SimulationNodeDatum, ZoomBehavior } from 'd3'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type Node = SimulationNodeDatum & Skill
type Link = SimulationLinkDatum<Node> & { source: Node | string; target: Node | string }

const emit = defineEmits<{
  select: [skill: Skill]
}>()

defineProps<{
  selectedId?: string
}>()

const reduced = usePrefersReducedMotion()
const svg = ref<SVGSVGElement | null>(null)
const width = ref(800)
const height = ref(560)
const nodes = ref<Node[]>([])
const links = ref<{ x1: number; y1: number; x2: number; y2: number }[]>([])
const panX = ref(0)
const panY = ref(0)
const scale = ref(1)
const panning = ref(false)

const worldTransform = computed(() => `translate(${panX.value} ${panY.value}) scale(${scale.value})`)
const canReset = computed(() => Math.abs(panX.value) > 1 || Math.abs(panY.value) > 1 || Math.abs(scale.value - 1) > 0.02)
const duration = computed(() => (reduced.value ? 0 : 380))

let sim: ReturnType<typeof forceSimulation<Node>> | undefined
let resizeObserver: ResizeObserver | undefined
let zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> | undefined

function motion() {
  return duration.value
}

function layout() {
  const host = svg.value?.parentElement
  if (host) {
    width.value = Math.max(host.clientWidth, 1)
    height.value =
      width.value < 640
        ? Math.max(280, Math.min(420, width.value * 0.9))
        : Math.max(420, Math.min(640, width.value * 0.62))
  }

  const graphNodes: Node[] = skills.map((skill) => ({ ...skill }))
  const graphLinks: Link[] = skills.flatMap((skill) =>
    skill.links
      .filter((id) => skills.some((item) => item.id === id))
      .map((id) => ({ source: skill.id, target: id })),
  )
  const isNarrow = width.value < 640
  const linkDistance = isNarrow ? 56 : 88
  const charge = isNarrow ? -140 : -220

  sim?.stop()
  sim = forceSimulation(graphNodes)
    .force(
      'link',
      forceLink<Node, Link>(graphLinks)
        .id((d) => d.id)
        .distance(linkDistance)
        .strength(0.35),
    )
    .force('charge', forceManyBody().strength(charge))
    .force('center', forceCenter(width.value / 2, height.value / 2))
    .force('collide', forceCollide<Node>().radius((d) => 18 + d.level * 3))
    .on('tick', () => {
      nodes.value = graphNodes.map((node) => ({ ...node }))
      links.value = graphLinks.map((link) => {
        const source = link.source as Node
        const target = link.target as Node
        return {
          x1: source.x ?? 0,
          y1: source.y ?? 0,
          x2: target.x ?? 0,
          y2: target.y ?? 0,
        }
      })
    })
}

function attachZoom() {
  const el = svg.value
  if (!el) return

  zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.4, 6])
    .clickDistance(8)
    .filter((event) => {
      if (event.type === 'wheel') return true
      const target = event.target as Element | null
      const onNode = Boolean(target?.closest?.('.constellation__node'))
      if (onNode && (event.type === 'mousedown' || event.type === 'touchstart')) return false
      if (event.type.startsWith('touch')) return true
      return !event.ctrlKey && event.button === 0
    })
    .on('start', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
      if (event.sourceEvent) panning.value = true
    })
    .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
      panX.value = event.transform.x
      panY.value = event.transform.y
      scale.value = event.transform.k
    })
    .on('end', () => {
      panning.value = false
    })

  select(el).call(zoomBehavior).on('dblclick.zoom', null)
}

function zoomBy(factor: number) {
  const el = svg.value
  if (!el || !zoomBehavior) return
  select(el).transition().duration(motion()).call(zoomBehavior.scaleBy, factor)
}

function resetView() {
  const el = svg.value
  if (!el || !zoomBehavior) return
  select(el).transition().duration(motion()).call(zoomBehavior.transform, zoomIdentity)
}

function zoomToNode(node: Node) {
  const el = svg.value
  if (!el || !zoomBehavior || node.x == null || node.y == null) return
  const k = Math.min(6, Math.max(scale.value, 1.75))
  const next = zoomIdentity.translate(width.value / 2, height.value / 2).scale(k).translate(-node.x, -node.y)
  select(el).transition().duration(motion()).call(zoomBehavior.transform, next)
}

function onSelect(node: Node) {
  emit('select', node)
  zoomToNode(node)
}

function onKey(event: KeyboardEvent, node: Node) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onSelect(node)
  }
}

function onWheel(event: WheelEvent) {
  event.stopPropagation()
}

onMounted(() => {
  layout()
  attachZoom()
  const host = svg.value?.parentElement
  if (host) {
    resizeObserver = new ResizeObserver(() => layout())
    resizeObserver.observe(host)
  }
})

onUnmounted(() => {
  sim?.stop()
  resizeObserver?.disconnect()
  if (svg.value) select(svg.value).on('.zoom', null)
})

watch(
  () => [width.value, height.value],
  () => {
    sim?.force('center', forceCenter(width.value / 2, height.value / 2))
    sim?.alpha(0.4).restart()
  },
)
</script>

<template>
  <div class="constellation" :class="{ 'is-panning': panning }">
    <svg
      ref="svg"
      :viewBox="`0 0 ${width} ${height}`"
      role="group"
      aria-label="Skill constellation. Scroll to zoom, drag to pan, click a node to focus."
      @wheel="onWheel"
    >
      <g :transform="worldTransform">
        <line
          v-for="(link, index) in links"
          :key="index"
          :x1="link.x1"
          :y1="link.y1"
          :x2="link.x2"
          :y2="link.y2"
          class="constellation__link"
          :stroke-width="1 / scale"
        />
        <g
          v-for="node in nodes"
          :key="node.id"
          class="constellation__node"
          :class="{ 'is-selected': selectedId === node.id }"
          tabindex="0"
          role="button"
          :aria-label="node.name"
          :aria-pressed="selectedId === node.id"
          :transform="`translate(${node.x ?? 0} ${node.y ?? 0})`"
          @click.stop="onSelect(node)"
          @keydown="onKey($event, node)"
        >
          <circle
            :r="10 + node.level * 2.2"
            :fill="skillGroupColor[node.group]"
            :stroke="skillGroupColor[node.group]"
          />
          <text y="28">{{ node.name }}</text>
        </g>
      </g>
    </svg>

    <div class="constellation__hud" role="toolbar" aria-label="Zoom controls">
      <button type="button" aria-label="Zoom out" @click="zoomBy(0.7)">−</button>
      <button type="button" aria-label="Reset view" :disabled="!canReset" @click="resetView">Reset</button>
      <button type="button" aria-label="Zoom in" @click="zoomBy(1.4)">+</button>
    </div>
  </div>
</template>

<style scoped>
.constellation {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  background:
    radial-gradient(circle at 50% 50%, rgba(194, 165, 116, 0.12), transparent 55%),
    var(--bg-elev);
  border-radius: var(--radius);
  touch-action: none;
  overscroll-behavior: contain;
  user-select: none;
}

svg {
  display: block;
  width: 100%;
  height: auto;
  cursor: grab;
}

.constellation.is-panning svg {
  cursor: grabbing;
}

.constellation__link {
  stroke: rgba(79, 93, 67, 0.22);
  pointer-events: none;
}

.constellation__node {
  cursor: pointer;
}

.constellation__node circle {
  fill-opacity: 0.22;
  stroke-width: 1.4;
  filter: drop-shadow(0 0 8px currentColor);
  transition:
    fill-opacity 0.2s var(--ease),
    stroke-width 0.2s var(--ease);
}

.constellation__node:hover circle,
.constellation__node.is-selected circle,
.constellation__node:focus-visible circle {
  fill-opacity: 0.55;
  stroke-width: 2;
}

.constellation__node:focus-visible {
  outline: none;
}

.constellation__node text {
  fill: var(--text);
  font-size: 11px;
  font-family: var(--font-mono);
  text-anchor: middle;
  pointer-events: none;
}

.constellation__hud {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  display: flex;
  gap: 0.3rem;
  z-index: 1;
}

.constellation__hud button {
  min-width: 2rem;
  height: 1.85rem;
  padding: 0 0.55rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgba(251, 248, 242, 0.92);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.constellation__hud button:hover:not(:disabled) {
  border-color: var(--earth);
  color: var(--earth);
}

.constellation__hud button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
