<script setup lang="ts">
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { onMounted, onUnmounted, ref } from 'vue'

type Vec3 = { x: number; y: number; z: number }
type Mat3 = number[][]

type GlobeSkill = {
  name: string
  devicon: string
  invert?: boolean
}

const ORBIT: GlobeSkill[] = [
  { name: 'Git', devicon: 'devicon-git-plain' },
  { name: 'GitHub', devicon: 'devicon-github-original', invert: true },
  { name: 'VS Code', devicon: 'devicon-vscode-plain' },
  { name: 'React', devicon: 'devicon-react-original' },
  { name: 'Redux', devicon: 'devicon-redux-original' },
  { name: 'Node.js', devicon: 'devicon-nodejs-plain' },
  { name: 'Express', devicon: 'devicon-express-original', invert: true },
  { name: 'Sequelize', devicon: 'devicon-sequelize-plain' },
  { name: 'PostgreSQL', devicon: 'devicon-postgresql-plain' },
  { name: 'MySQL', devicon: 'devicon-mysql-original' },
  { name: 'Redis', devicon: 'devicon-redis-plain' },
  { name: 'Python', devicon: 'devicon-python-plain' },
  { name: 'AWS', devicon: 'devicon-amazonwebservices-plain-wordmark' },
  { name: 'Firebase', devicon: 'devicon-firebase-plain' },
  { name: 'Tailwind', devicon: 'devicon-tailwindcss-original' },
  { name: 'Sass', devicon: 'devicon-sass-original' },
  { name: 'JavaScript', devicon: 'devicon-javascript-plain' },
  { name: 'Leaflet', devicon: 'devicon-leaflet-plain' },
]

const emit = defineEmits<{
  select: [name: string]
}>()

const reduced = usePrefersReducedMotion()
const rootEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const hovered = ref<string | null>(null)

function pick(name: string) {
  emit('select', name)
}

type Projected = { x: number; y: number; opacity: number; scale: number; front: boolean }

const projected = ref<Projected[]>(
  ORBIT.map(() => ({ x: 0, y: 0, opacity: 0, scale: 0.55, front: false })),
)

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / len, y: v.y / len, z: v.z / len }
}

function icosahedron() {
  const phi = (1 + Math.sqrt(5)) / 2
  const vertices: Vec3[] = [
    { x: -1, y: phi, z: 0 },
    { x: 1, y: phi, z: 0 },
    { x: -1, y: -phi, z: 0 },
    { x: 1, y: -phi, z: 0 },
    { x: 0, y: -1, z: phi },
    { x: 0, y: 1, z: phi },
    { x: 0, y: -1, z: -phi },
    { x: 0, y: 1, z: -phi },
    { x: phi, y: 0, z: -1 },
    { x: phi, y: 0, z: 1 },
    { x: -phi, y: 0, z: -1 },
    { x: -phi, y: 0, z: 1 },
  ].map(normalize)

  let faces = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ]

  const midCache: Record<string, number> = {}
  const midpoint = (a: number, b: number) => {
    const key = `${Math.min(a, b)}_${Math.max(a, b)}`
    if (key in midCache) return midCache[key]
    vertices.push(
      normalize({
        x: (vertices[a].x + vertices[b].x) / 2,
        y: (vertices[a].y + vertices[b].y) / 2,
        z: (vertices[a].z + vertices[b].z) / 2,
      }),
    )
    midCache[key] = vertices.length - 1
    return midCache[key]
  }

  const next: number[][] = []
  for (const [a, b, c] of faces) {
    const ab = midpoint(a, b)
    const bc = midpoint(b, c)
    const ca = midpoint(c, a)
    next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca])
  }
  faces = next

  const seen = new Set<string>()
  const edges: [number, number][] = []
  for (const [a, b, c] of faces) {
    for (const pair of [
      [a, b],
      [b, c],
      [c, a],
    ] as const) {
      const key = `${Math.min(pair[0], pair[1])}_${Math.max(pair[0], pair[1])}`
      if (!seen.has(key)) {
        seen.add(key)
        edges.push([pair[0], pair[1]])
      }
    }
  }
  return { vertices, edges }
}

function fibonacci(count: number) {
  const golden = Math.PI * (Math.sqrt(5) - 1)
  const points = Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * i + 1) / count
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r }
  })
  for (let i = points.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[points[i], points[j]] = [points[j], points[i]]
  }
  return points
}

function rotX(a: number): Mat3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [
    [1, 0, 0],
    [0, c, -s],
    [0, s, c],
  ]
}

function rotY(a: number): Mat3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [
    [c, 0, s],
    [0, 1, 0],
    [-s, 0, c],
  ]
}

function mul(a: Mat3, b: Mat3): Mat3 {
  const out: Mat3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      out[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]
    }
  }
  return out
}

function project(p: Vec3, cx: number, cy: number, radius: number, m: Mat3) {
  const x = m[0][0] * p.x + m[0][1] * p.y + m[0][2] * p.z
  const y = m[1][0] * p.x + m[1][1] * p.y + m[1][2] * p.z
  const z = m[2][0] * p.x + m[2][1] * p.y + m[2][2] * p.z
  return { sx: x * radius + cx, sy: y * radius + cy, sz: z }
}

function depthFade(sz: number) {
  if (sz >= 0.2) return 1
  if (sz <= -0.15) return 0
  const t = (sz + 0.15) / 0.35
  return t * t * (3 - 2 * t)
}

function theme() {
  const styles = getComputedStyle(document.documentElement)
  const olive = styles.getPropertyValue('--olive-rgb').trim().replace(/\s+/g, ',')
  const bg = styles.getPropertyValue('--bg-rgb').trim().replace(/\s+/g, ',')
  const elev = styles.getPropertyValue('--bg-elev-rgb').trim().replace(/\s+/g, ',')
  const dark = document.documentElement.dataset.theme === 'dark'
  return { olive, bg, elev, dark }
}

let raf = 0
let running = true
let dispose: (() => void) | undefined
const mesh = icosahedron()
const orbit = fibonacci(ORBIT.length)
const opacities = new Float64Array(ORBIT.length).fill(1)

onMounted(() => {
  const wrap = rootEl.value
  const canvas = canvasEl.value
  if (!wrap || !canvas) return

  if (!document.querySelector('link[data-devicon]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@2.16.0/devicon.min.css'
    link.dataset.devicon = 'true'
    document.head.appendChild(link)
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dprCap = Math.min(window.devicePixelRatio || 1, 2)
  let width = 0
  let height = 0
  let cx = 0
  let cy = 0
  let radius = 0

  const resize = () => {
    const box = wrap.getBoundingClientRect()
    width = Math.round(box.width)
    height = Math.round(box.height)
    if (!width || !height) return
    canvas.width = Math.round(width * dprCap)
    canvas.height = Math.round(height * dprCap)
    cx = width / 2
    cy = height / 2
    radius = 0.4 * Math.min(width, height)
  }

  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(wrap)

  let matrix = mul(rotX(0.4), rotY(0.2))
  let pitch = 0.4
  let pitchVel = 0
  let yawVel = reduced.value ? 0 : 0.005
  let dragging = false
  let lastX = 0
  let lastY = 0
  let last = performance.now()

  const paint = (now: number) => {
    const dt = Math.min((now - last) / 16.667, 3)
    last = now
    if (!dragging && !reduced.value) {
      yawVel += (0.005 - yawVel) * 0.03 * dt
      pitchVel *= 0.85
    }
    matrix = mul(rotX(-pitchVel * dt), mul(rotY(yawVel * dt), matrix))
    const limit = Math.PI / 3
    pitch += pitchVel * dt
    if (pitch > limit) {
      pitch = limit
      pitchVel = 0
    } else if (pitch < -limit) {
      pitch = -limit
      pitchVel = 0
    }

    const { olive, elev, dark } = theme()
    ctx.setTransform(dprCap, 0, 0, dprCap, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const glowR = radius * 1.18
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, glowR)
    glow.addColorStop(0, `rgba(${olive}, 0)`)
    glow.addColorStop(0.35, `rgba(${olive}, 0.02)`)
    glow.addColorStop(0.65, `rgba(${olive}, 0.07)`)
    glow.addColorStop(1, `rgba(${olive}, 0)`)
    ctx.beginPath()
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()

    ctx.save()
    ctx.shadowColor = `rgba(${olive}, 0.25)`
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${olive}, 0.15)`
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = dark ? 'rgba(28, 26, 26, 0.88)' : `rgba(${elev}, 0.92)`
    ctx.fill()
    ctx.clip()

    const verts = mesh.vertices.map((v) => project(v, cx, cy, radius, matrix))
    const lines = mesh.edges
      .map(([a, b]) => ({ p1: verts[a], p2: verts[b], d: (verts[a].sz + verts[b].sz) / 2 }))
      .sort((a, b) => a.d - b.d)
    for (const { p1, p2, d } of lines) {
      const alpha = 0.06 + ((d + 1) / 2) * 0.29
      ctx.beginPath()
      ctx.moveTo(p1.sx, p1.sy)
      ctx.lineTo(p2.sx, p2.sy)
      ctx.strokeStyle = `rgba(${olive}, ${alpha.toFixed(2)})`
      ctx.lineWidth = 0.7
      ctx.stroke()
    }

    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(1, 0.28)
    ctx.beginPath()
    ctx.arc(0, 0, radius * 1.06, 0, Math.PI * 2)
    ctx.restore()
    ctx.strokeStyle = `rgba(${olive}, 0.12)`
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(Math.PI / 7)
    ctx.scale(1, 0.32)
    ctx.beginPath()
    ctx.arc(0, 0, radius * 1.1, 0, Math.PI * 2)
    ctx.restore()
    ctx.strokeStyle = `rgba(${olive}, 0.07)`
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()

    const next = projected.value.map((item) => ({ ...item }))
    for (let i = 0; i < orbit.length; i += 1) {
      const p = project(orbit[i], cx, cy, radius * 1.2, matrix)
      const fade = depthFade(p.sz)
      opacities[i] = 0.7 * opacities[i] + 0.3 * fade
      next[i] = {
        x: p.sx - cx,
        y: p.sy - cy,
        opacity: opacities[i],
        scale: 0.55 + 0.45 * opacities[i],
        front: fade > 0.08,
      }
    }
    projected.value = next

    if (running) raf = requestAnimationFrame(paint)
  }

  const onPointerDown = (event: MouseEvent | TouchEvent) => {
    dragging = true
    const point = 'touches' in event ? event.touches[0] : event
    lastX = point.clientX
    lastY = point.clientY
  }

  const onPointerMove = (event: MouseEvent | TouchEvent) => {
    if (!dragging) return
    const point = 'touches' in event ? event.touches[0] : event
    const dx = (point.clientX - lastX) * 0.04
    const dy = (point.clientY - lastY) * 0.04
    yawVel = 0.15 * yawVel + 0.85 * dx
    pitchVel = 0.15 * pitchVel + 0.85 * dy
    yawVel = Math.min(0.12, Math.max(-0.12, yawVel))
    pitchVel = Math.min(0.12, Math.max(-0.12, pitchVel))
    lastX = point.clientX
    lastY = point.clientY
  }

  const onPointerUp = () => {
    dragging = false
  }

  canvas.addEventListener('mousedown', onPointerDown)
  canvas.addEventListener('touchstart', onPointerDown, { passive: true })
  canvas.addEventListener('touchmove', onPointerMove, { passive: true })
  canvas.addEventListener('touchend', onPointerUp)
  window.addEventListener('mousemove', onPointerMove)
  window.addEventListener('mouseup', onPointerUp)

  const io = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting
      if (running) {
        last = performance.now()
        raf = requestAnimationFrame(paint)
      } else {
        cancelAnimationFrame(raf)
        raf = 0
      }
    },
    { threshold: 0 },
  )
  io.observe(wrap)
  raf = requestAnimationFrame(paint)

  dispose = () => {
    running = false
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    canvas.removeEventListener('mousedown', onPointerDown)
    canvas.removeEventListener('touchstart', onPointerDown)
    canvas.removeEventListener('touchmove', onPointerMove)
    canvas.removeEventListener('touchend', onPointerUp)
    window.removeEventListener('mousemove', onPointerMove)
    window.removeEventListener('mouseup', onPointerUp)
  }
})

onUnmounted(() => {
  dispose?.()
})
</script>

<template>
  <div ref="rootEl" class="globe">
    <canvas
      ref="canvasEl"
      class="globe__canvas"
      aria-label="Drag to rotate the skills globe"
    />
    <div class="globe__overlay">
      <div
        v-for="(skill, index) in ORBIT"
        :key="skill.name"
        class="globe__node"
        :class="{ 'is-on': hovered === skill.name }"
        :style="{
          transform: `translate(calc(-50% + ${projected[index]?.x ?? 0}px), calc(-50% + ${projected[index]?.y ?? 0}px)) scale(${projected[index]?.scale ?? 0.55})`,
          opacity: projected[index]?.opacity ?? 0,
          zIndex: projected[index]?.front ? 10 : 1,
          pointerEvents: projected[index]?.front ? 'auto' : 'none',
        }"
        role="button"
        tabindex="0"
        @mouseenter="hovered = skill.name"
        @mouseleave="hovered = null"
        @click.stop="pick(skill.name)"
        @keydown.enter.prevent="pick(skill.name)"
        @keydown.space.prevent="pick(skill.name)"
      >
        <i :class="[skill.devicon, skill.invert ? 'is-invert' : 'colored']" />
        <span>{{ skill.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.globe {
  --globe-icon-base: clamp(1.35rem, 4vw, 2.5rem);
  --globe-icon-gap: clamp(0.6rem, 1.5vw, 1.2rem);
  --globe-label-size: 0.7rem;
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  user-select: none;
}

.globe__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
}

.globe__canvas:active {
  cursor: grabbing;
}

.globe__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.globe__node {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--globe-icon-gap);
  cursor: pointer;
  will-change: transform, opacity;
}

.globe__node i {
  display: block;
  font-size: var(--globe-icon-base);
  transform: scale(1.9);
  filter: none;
  transition:
    transform 200ms ease-out,
    filter 200ms ease-out;
}

.globe__node i.is-invert {
  color: var(--text);
}

.globe__node.is-on i {
  transform: translateY(calc(-0.7 * var(--globe-icon-base))) scale(2.2);
  filter: drop-shadow(0 0 10px rgb(var(--olive-rgb) / 0.9)) brightness(1.3);
}

.globe__node span {
  padding: 2px 6px;
  border-radius: 4px;
  background: transparent;
  font-family: var(--font-mono);
  font-size: var(--globe-label-size);
  line-height: 1;
  color: rgb(var(--text-rgb) / 0.72);
  white-space: nowrap;
  transition:
    color 150ms,
    background-color 150ms;
}

.globe__node.is-on span {
  background: rgb(var(--olive-rgb) / 0.18);
  color: var(--olive);
}
</style>
