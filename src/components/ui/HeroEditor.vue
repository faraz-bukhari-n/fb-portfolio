<script setup lang="ts">
import ChamferLink from '@/components/ui/ChamferLink.vue'
import { identity } from '@/content'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  reduced: boolean
}>()

type Token = { kind: string; text: string }

const source = [
  '// Welcome to my workspace',
  "import { Developer } from './universe';",
  '',
  'const Portfolio = () => {',
  '  return (',
  '    <Developer',
  `      name="${identity.name}"`,
  '      role="Senior Full-Stack · Team Lead"',
      '      craft="WebGIS · scale · AI"',
  '    />',
  '  );',
  '};',
]

function highlight(line: string): Token[] {
  if (!line) return [{ kind: 'txt', text: ' ' }]
  if (line.trimStart().startsWith('//')) return [{ kind: 'cmt', text: line }]

  const tokens: Token[] = []
  const rx =
    /(\s+)|('[^']*'|"[^"]*")|\b(import|from|return)\b|\b(const)\b|\b(Developer|Portfolio)\b|\b(name|role|craft)\b|([<>/{}()=;]+)|(\w+)/g
  let match: RegExpExecArray | null
  let cursor = 0
  while ((match = rx.exec(line))) {
    if (match.index > cursor) tokens.push({ kind: 'txt', text: line.slice(cursor, match.index) })
    const [raw, space, str, kw, kwAlt, fn, attr, punct, word] = match
    if (space) tokens.push({ kind: 'txt', text: space })
    else if (str) tokens.push({ kind: 'str', text: str })
    else if (kw) tokens.push({ kind: 'kw', text: kw })
    else if (kwAlt) tokens.push({ kind: 'kw-alt', text: kwAlt })
    else if (fn) tokens.push({ kind: 'fn', text: fn })
    else if (attr) tokens.push({ kind: 'attr', text: attr })
    else if (punct) tokens.push({ kind: 'p', text: punct })
    else tokens.push({ kind: 'txt', text: word })
    cursor = match.index + raw.length
  }
  if (cursor < line.length) tokens.push({ kind: 'txt', text: line.slice(cursor) })
  return tokens
}

const lines = source.map(highlight)
const shown = ref(props.reduced ? lines.length + 1 : 0)
const tilt = ref({ x: 0, y: 0 })
let typeTimer: number | undefined

onMounted(() => {
  if (props.reduced) return
  typeTimer = window.setInterval(() => {
    shown.value += 1
    if (shown.value > lines.length && typeTimer) window.clearInterval(typeTimer)
  }, 85)
})

onUnmounted(() => {
  if (typeTimer) window.clearInterval(typeTimer)
})

function onMove(event: MouseEvent) {
  if (props.reduced) return
  const el = event.currentTarget as HTMLElement
  const box = el.getBoundingClientRect()
  const px = (event.clientX - box.left) / box.width - 0.5
  const py = (event.clientY - box.top) / box.height - 0.5
  tilt.value = { x: py * -6, y: px * 8 }
}

function onLeave() {
  tilt.value = { x: 0, y: 0 }
}
</script>

<template>
  <div class="editor" :class="{ 'is-static': reduced }" :style="{ '--d': '0.28s' }">
    <div class="editor__enter">
    <div
      class="editor__tilt"
      :style="{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      <div class="editor__window">
        <header class="editor__bar">
          <span class="editor__dots" aria-hidden="true"><i /><i /><i /></span>
          <span class="editor__title">portfolio.tsx</span>
        </header>
        <pre class="editor__code" aria-label="portfolio.tsx"><code><span
            v-for="(line, i) in lines"
            :key="i"
            class="line"
            :class="{ 'is-on': shown > i }"
          ><span v-for="(tok, j) in line" :key="j" :class="tok.kind">{{ tok.text }}</span></span><span
            class="line is-caret"
            :class="{ 'is-on': shown > lines.length }"
          ><span v-if="!reduced" class="caret" /></span></code></pre>
      </div>
    </div>
    </div>
    <div class="editor__actions">
      <ChamferLink class="editor__btn" href="#climb" fill glow="hot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Run Profile</span>
      </ChamferLink>
      <ChamferLink class="editor__btn" to="/work" fill glow="warm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span>View Projects</span>
      </ChamferLink>
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.editor__enter {
  animation: slideUp 0.6s ease-out both;
  animation-delay: var(--d, 0.28s);
}

.editor__tilt {
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out;
}

.editor__window {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg-elev);
  box-shadow: var(--glow-cyan);
  overflow: hidden;
  transition: box-shadow 0.5s ease;
}

.editor__tilt:hover .editor__window {
  box-shadow: 0 0 40px rgb(var(--olive-rgb) / 0.18);
}

.editor__bar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 2.3rem;
  padding: 0 2.6rem 0 1rem;
  background: var(--bg-elev-2);
  border-bottom: 1px solid var(--line);
}

.editor__dots {
  position: absolute;
  left: 1rem;
  display: flex;
  gap: 0.35rem;
}

.editor__dots i {
  width: 0.62rem;
  height: 0.62rem;
  border-radius: 999px;
  background: var(--dot-red);
}

.editor__dots i:nth-child(2) {
  background: var(--dot-gold);
}

.editor__dots i:nth-child(3) {
  background: var(--dot-green);
}

.editor__title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--muted);
}

.editor__code {
  margin: 0;
  padding: 1.05rem 1rem 1.15rem 0;
  overflow-x: auto;
  counter-reset: ln;
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 1.5vw, 0.88rem);
  line-height: 1.7;
  color: var(--text);
  tab-size: 2;
}

.editor__code code {
  display: block;
  font: inherit;
}

.line {
  display: block;
  min-height: 1.7em;
  padding: 0 1rem 0 0;
  opacity: 0;
  white-space: pre;
  transition: opacity 0.15s ease-out;
}

.line::before {
  content: counter(ln);
  counter-increment: ln;
  display: inline-block;
  width: 2.5rem;
  margin-right: 0.9rem;
  text-align: right;
  color: var(--olive);
  user-select: none;
}

.line.is-on {
  opacity: 1;
}

.line.is-on:nth-last-child(2) {
  animation: typingGlow 2s ease-in-out infinite;
}

.cmt,
.p {
  color: var(--muted);
}

.cmt {
  font-style: italic;
}

.kw {
  color: var(--cyan);
}

.kw-alt {
  color: var(--earth);
}

.fn {
  color: var(--olive);
}

.attr {
  color: var(--cyan);
}

.str {
  color: var(--amber);
}

.caret {
  display: inline-block;
  width: 0.5rem;
  height: 1em;
  vertical-align: -0.15em;
  background: var(--olive);
  animation: blink 1s step-end infinite;
}

.editor__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
  align-items: stretch;
  animation: fadeIn 0.6s ease-out both;
  animation-delay: 0.45s;
}

.editor__btn {
  width: 100%;
  display: flex;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 500;
}

.editor__btn svg {
  width: 1rem;
  height: 1rem;
  color: var(--text);
  transition: color 0.2s ease;
}

.editor__btn span {
  color: var(--text);
  white-space: nowrap;
  transition: color 0.2s ease;
}

.editor__btn:hover svg,
.editor__btn:hover span {
  color: var(--cyan);
}

.editor__face {
  position: absolute;
  top: 0.55rem;
  right: 0.7rem;
  z-index: 2;
  width: 1.85rem;
  height: 1.85rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgb(var(--olive-rgb) / 0.45);
  font-family: var(--font-display);
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--olive);
  background: var(--bg-elev);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes typingGlow {
  0%,
  100% {
    text-shadow: 0 0 2px rgb(var(--olive-rgb) / 0.12);
  }
  50% {
    text-shadow: 0 0 8px rgb(var(--olive-rgb) / 0.28);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgb(var(--olive-rgb) / 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgb(var(--olive-rgb) / 0.55);
  }
}

.editor.is-static,
.editor.is-static .editor__enter,
.editor.is-static .editor__actions,
.editor.is-static .line,
.editor.is-static .caret,
.editor.is-static .editor__face {
  animation: none !important;
}

.editor.is-static .line {
  opacity: 1;
}

@media (max-width: 520px) {
  .editor__actions {
    grid-template-columns: 1fr;
  }
}
</style>
