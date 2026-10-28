<script setup lang="ts">
import { climbMilestones, type ClimbMilestone } from '@/content'
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  reduced: boolean
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const playing = ref(false)
const gas = ref(false)
const reverse = ref(false)
const distance = ref(0)
const activeId = ref(climbMilestones[0]?.id ?? '')
const unlocked = ref<string[]>([])

const active = computed(
  () => climbMilestones.find((item) => item.id === activeId.value) ?? climbMilestones[0],
)

const TRACK_END = 4600
const WHEELBASE = 50
const WHEEL_R = 10

let raf = 0
let last = 0
let ctx: CanvasRenderingContext2D | null = null
let observer: ResizeObserver | null = null
let width = 800
let height = 420
let dpr = 1

const car = {
  x: 90,
  y: 180,
  rot: 0,
  vx: 0,
  vy: 0,
  omega: 0,
}

const keys = new Set<string>()
const seen = new Set<string>()

function css(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

function ground(x: number) {
  const y =
    height * 0.62 +
    Math.sin(x * 0.009) * 52 +
    Math.sin(x * 0.017 + 0.8) * 26 +
    Math.sin(x * 0.033 + 1.4) * 12
  const dydx =
    Math.cos(x * 0.009) * 52 * 0.009 +
    Math.cos(x * 0.017 + 0.8) * 26 * 0.017 +
    Math.cos(x * 0.033 + 1.4) * 12 * 0.033
  return { y, dydx }
}

function wheel(localX: number, localY: number) {
  const cos = Math.cos(car.rot)
  const sin = Math.sin(car.rot)
  return {
    x: car.x + cos * localX - sin * localY,
    y: car.y + sin * localX + cos * localY,
  }
}

function roundRectPath(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  if (typeof g.roundRect === 'function') {
    g.roundRect(x, y, w, h, r)
    return
  }
  g.rect(x, y, w, h)
}

function resetTo(x: number) {
  const g = ground(x)
  car.x = x
  car.y = g.y - 22
  car.rot = Math.atan(g.dydx)
  car.vx = 0
  car.vy = 0
  car.omega = 0
}

function unlockAt(x: number) {
  let current: ClimbMilestone = climbMilestones[0]
  for (const mile of climbMilestones) {
    if (x >= mile.at) {
      current = mile
      if (!seen.has(mile.id)) {
        seen.add(mile.id)
        unlocked.value = [...seen]
      }
    }
  }
  activeId.value = current.id
}

function step(dt: number) {
  const wantGas = gas.value || keys.has('ArrowRight') || keys.has('KeyD') || keys.has('Space')
  const wantReverse = reverse.value || keys.has('ArrowLeft') || keys.has('KeyA')
  const rear = wheel(-WHEELBASE / 2, 11)
  const front = wheel(WHEELBASE / 2, 11)
  const rearG = ground(rear.x)
  const frontG = ground(front.x)
  const rearPen = rear.y - (rearG.y - WHEEL_R)
  const frontPen = front.y - (frontG.y - WHEEL_R)
  const rearHit = rearPen > -1
  const frontHit = frontPen > -1
  const grounded = rearHit || frontHit

  car.vy += 980 * dt
  if (!grounded) car.omega += (wantGas ? 1.8 : 0) * dt - (wantReverse ? 1.8 : 0) * dt

  if (rearHit) {
    car.y -= rearPen * (frontHit ? 0.5 : 1)
    car.vy *= 0.35
  }
  if (frontHit) {
    car.y -= frontPen * (rearHit ? 0.5 : 1)
    car.vy *= 0.35
  }

  const slope = Math.atan((frontG.dydx + rearG.dydx) / 2)
  if (grounded) {
    const align = Math.atan2(frontG.y - rearG.y, WHEELBASE)
    car.rot += (align - car.rot) * Math.min(1, 10 * dt)
    car.omega *= 0.2
    const along = Math.cos(slope)
    if (wantGas) car.vx += along * 520 * dt
    if (wantReverse) car.vx -= along * 520 * dt
    car.vx += Math.sin(slope) * 220 * dt
    car.vx *= Math.exp(-1.6 * dt)
    car.vy *= 0.55
  } else {
    car.rot += car.omega * dt
    car.vx *= Math.exp(-0.15 * dt)
  }

  car.vx = Math.max(-380, Math.min(460, car.vx))
  car.x += car.vx * dt
  car.y += car.vy * dt
  if (car.x < 40) {
    car.x = 40
    car.vx = 0
  }
  if (car.x > TRACK_END) {
    car.x = TRACK_END
    car.vx *= 0.4
  }

  if (Math.abs(car.rot) > 2.4 || car.y > height + 120) {
    const lastMile = [...climbMilestones].reverse().find((mile) => car.x >= mile.at)
    resetTo(lastMile?.at ?? 90)
  }

  distance.value = Math.max(0, Math.round(car.x))
  unlockAt(car.x)
}

function draw() {
  const g = ctx
  if (!g) return
  const bg = css('--bg', '#07090d')
  const elev = css('--bg-elev', '#0d1218')
  const earth = css('--earth', '#f0c4d0')
  const olive = css('--olive', '#e8a0b4')
  const text = css('--text', '#e8eef6')
  const mutedTone = css('--muted', '#8b98a8')
  const line = css('--line', 'rgba(232,238,246,0.1)')

  const camX = car.x - width * 0.32
  const camY = car.y - height * 0.58

  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, width, height)
  g.fillStyle = bg
  g.fillRect(0, 0, width, height)

  g.save()
  g.strokeStyle = line
  g.lineWidth = 1
  const grid = 32
  for (let x = -((camX % grid) + grid); x < width + grid; x += grid) {
    g.beginPath()
    g.moveTo(x, 0)
    g.lineTo(x, height)
    g.stroke()
  }
  for (let y = -((camY % grid) + grid); y < height + grid; y += grid) {
    g.beginPath()
    g.moveTo(0, y)
    g.lineTo(width, y)
    g.stroke()
  }
  g.restore()

  g.save()
  g.translate(-camX, -camY)

  g.beginPath()
  const startX = camX - 40
  const endX = camX + width + 80
  g.moveTo(startX, camY + height + 200)
  g.lineTo(startX, ground(startX).y)
  for (let x = startX; x <= endX; x += 8) {
    g.lineTo(x, ground(x).y)
  }
  g.lineTo(endX, camY + height + 200)
  g.closePath()
  g.fillStyle = elev
  g.fill()
  g.strokeStyle = olive
  g.lineWidth = 2
  g.stroke()

  g.font = '500 11px "IBM Plex Mono", monospace'
  for (const mile of climbMilestones) {
    const gy = ground(mile.at).y
    const on = mile.id === activeId.value
    const done = seen.has(mile.id)
    g.strokeStyle = on ? olive : done ? earth : line
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(mile.at, gy)
    g.lineTo(mile.at, gy - 64)
    g.stroke()
    const label = mile.kicker
    const plaqueW = Math.max(52, g.measureText(label).width + 14)
    g.fillStyle = on ? olive : done ? earth : elev
    g.strokeStyle = on ? olive : done ? earth : line
    g.beginPath()
    roundRectPath(g, mile.at + 4, gy - 76, plaqueW, 22, 3)
    g.fill()
    g.lineWidth = 1
    g.stroke()
    g.fillStyle = on || done ? bg : text
    g.fillText(label, mile.at + 11, gy - 61)
  }

  const rear = wheel(-WHEELBASE / 2, 11)
  const front = wheel(WHEELBASE / 2, 11)
  g.fillStyle = text
  g.beginPath()
  g.arc(rear.x, rear.y, WHEEL_R, 0, Math.PI * 2)
  g.arc(front.x, front.y, WHEEL_R, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = olive
  g.beginPath()
  g.arc(rear.x, rear.y, 3.2, 0, Math.PI * 2)
  g.arc(front.x, front.y, 3.2, 0, Math.PI * 2)
  g.fill()

  g.save()
  g.translate(car.x, car.y)
  g.rotate(car.rot)
  g.fillStyle = earth
  g.beginPath()
  roundRectPath(g, -26, -10, 52, 16, 3)
  g.fill()
  g.fillStyle = olive
  g.beginPath()
  roundRectPath(g, -8, -18, 22, 10, 2)
  g.fill()
  g.restore()

  g.restore()

  g.fillStyle = mutedTone
  g.font = '500 11px "IBM Plex Mono", monospace'
  g.fillText(`${String(Math.min(TRACK_END, distance.value)).padStart(4, '0')} m`, 14, 22)
}

function loop(now: number) {
  const dt = Math.min(0.033, (now - last) / 1000 || 0.016)
  last = now
  if (playing.value && !props.reduced) step(dt)
  draw()
  raf = requestAnimationFrame(loop)
}

function resize(initial = false) {
  const el = canvas.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  width = Math.max(320, Math.floor(rect.width) || 320)
  height = Math.max(260, Math.floor(rect.height) || 260)
  dpr = Math.min(2, window.devicePixelRatio || 1)
  const nextW = Math.floor(width * dpr)
  const nextH = Math.floor(height * dpr)
  const changed = el.width !== nextW || el.height !== nextH
  if (changed) {
    el.width = nextW
    el.height = nextH
  }
  ctx = el.getContext('2d')
  if (initial) {
    resetTo(90)
    return
  }
  if (changed) {
    const g = ground(car.x)
    car.y = g.y - 22
    car.rot = Math.atan(g.dydx)
  }
}

function onKey(event: KeyboardEvent, down: boolean) {
  if (!['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space', 'KeyR'].includes(event.code)) return
  if (event.code === 'Space' || event.code.startsWith('Arrow')) event.preventDefault()
  if (down) keys.add(event.code)
  else keys.delete(event.code)
  if (down && event.code === 'KeyR') resetTo(Math.max(90, car.x - 80))
  if (down) playing.value = true
}

function startDrive() {
  playing.value = true
}

function setPedal(kind: 'gas' | 'reverse', on: boolean, event?: PointerEvent) {
  playing.value = true
  if (event && on) {
    try {
      ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    } catch {
      /* untrusted events in tests */
    }
  }
  if (kind === 'gas') gas.value = on
  else reverse.value = on
}

onMounted(() => {
  resize(true)
  last = performance.now()
  raf = requestAnimationFrame(loop)
  const el = canvas.value
  if (el && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => resize())
    observer.observe(el)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
  observer = null
})

watch(
  () => props.reduced,
  (off) => {
    if (off) playing.value = false
  },
)

useEventListener(window, 'keydown', (event: KeyboardEvent) => onKey(event, true))
useEventListener(window, 'keyup', (event: KeyboardEvent) => onKey(event, false))
useEventListener(window, 'resize', () => resize())
useEventListener(window, 'blur', () => {
  keys.clear()
  gas.value = false
  reverse.value = false
})
</script>

<template>
  <div class="climb">
    <div v-if="reduced" class="climb__list">
      <article v-for="mile in climbMilestones" :key="mile.id">
        <p class="kicker">{{ mile.kicker }}</p>
        <h3>{{ mile.title }}</h3>
        <p>{{ mile.line }}</p>
      </article>
    </div>
    <template v-else>
      <canvas
        ref="canvas"
        class="climb__canvas"
        tabindex="0"
        role="application"
        aria-label="Drive the car along the hills. D or Gas forward, A or Reverse backward."
        @pointerdown="startDrive"
        @wheel.prevent
      />
      <ol class="climb__dots" aria-label="Milestones">
        <li
          v-for="mile in climbMilestones"
          :key="mile.id"
          :class="{ 'is-on': unlocked.includes(mile.id), 'is-now': mile.id === activeId }"
        >
          {{ mile.kicker }}
        </li>
      </ol>
      <div class="climb__card" :key="active.id">
        <p class="kicker">{{ active.kicker }}</p>
        <h3>{{ active.title }}</h3>
        <p>{{ active.line }}</p>
      </div>
      <div class="climb__pedals">
        <button
          type="button"
          :class="{ 'is-on': reverse }"
          aria-label="Reverse"
          @pointerdown.prevent="setPedal('reverse', true, $event)"
          @pointerup.prevent="setPedal('reverse', false)"
          @pointercancel="setPedal('reverse', false)"
          @selectstart.prevent
          @contextmenu.prevent
        >
          Reverse
        </button>
        <button
          type="button"
          :class="{ 'is-on': gas }"
          aria-label="Gas"
          @pointerdown.prevent="setPedal('gas', true, $event)"
          @pointerup.prevent="setPedal('gas', false)"
          @pointercancel="setPedal('gas', false)"
          @selectstart.prevent
          @contextmenu.prevent
        >
          Gas
        </button>
      </div>
      <p v-if="!playing" class="climb__hint">D gas · A reverse</p>
    </template>
  </div>
</template>

<style scoped>
.climb {
  position: relative;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-elev);
  min-width: 0;
  box-shadow: var(--glow-cyan);
}

.climb__canvas {
  display: block;
  width: 100%;
  height: min(56vh, 500px);
  min-height: 280px;
  touch-action: none;
  cursor: grab;
}

.climb__canvas:focus {
  outline: none;
}

.climb__dots {
  position: absolute;
  top: 0.7rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  max-width: calc(100% - 2rem);
  margin: 0;
  padding: 0.28rem 0.4rem;
  list-style: none;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgb(var(--bg-elev-rgb) / 0.86);
  pointer-events: none;
}

.climb__dots li {
  width: 0.45rem;
  height: 0.45rem;
  overflow: hidden;
  text-indent: -999px;
  border-radius: 999px;
  background: var(--line-strong);
}

.climb__dots li.is-on {
  background: var(--earth);
}

.climb__dots li.is-now {
  background: var(--olive);
  box-shadow: 0 0 0 3px rgb(var(--olive-rgb) / 0.25);
}

.climb__card {
  position: absolute;
  left: 0.75rem;
  bottom: 3.4rem;
  max-width: min(22rem, calc(100% - 8.5rem));
  padding: 0.7rem 0.85rem 0.8rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: rgb(var(--bg-elev-rgb) / 0.92);
  pointer-events: none;
}

.climb__card h3 {
  margin: 0.15rem 0 0.25rem;
  font-size: 1.05rem;
  letter-spacing: -0.03em;
}

.climb__card p:last-child {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.4;
}

.climb__pedals {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  display: flex;
  gap: 0.4rem;
}

.climb__pedals button {
  min-width: 5.2rem;
  height: 2.4rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: rgb(var(--bg-elev-rgb) / 0.92);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.climb__pedals button.is-on {
  background: var(--olive);
  border-color: var(--olive);
  color: var(--bg);
}

.climb__hint {
  position: absolute;
  top: 0.7rem;
  left: 0.85rem;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  pointer-events: none;
}

.climb__list {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.climb__list article {
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.7rem;
}

.climb__list h3 {
  margin: 0.2rem 0 0.25rem;
}

.climb__list p:last-child {
  margin: 0;
  color: var(--muted);
}

@media (min-width: 720px) {
  .climb__card {
    bottom: 0.85rem;
    left: 0.9rem;
  }

  .climb__pedals {
    bottom: 0.85rem;
  }
}
</style>
