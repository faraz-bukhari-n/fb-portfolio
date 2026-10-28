<script setup lang="ts">
import { useGithubContributions, contributionLabel } from '@/composables/useGithubContributions'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const {
  username,
  href,
  weeks,
  months,
  total,
  years,
  selected,
  rangeLabel,
  loading,
  switching,
  error,
  selectYear,
  isYearOn,
} = useGithubContributions()
const reduced = usePrefersReducedMotion()
const root = ref<HTMLElement | null>(null)
const scroller = ref<HTMLElement | null>(null)
const tip = ref<{ x: number; y: number; shift: number; text: string } | null>(null)

const skeletonWeeks = Array.from({ length: 53 }, () => Array.from({ length: 7 }, () => 0))
const today = new Date().toISOString().slice(0, 10)

let resizeObserver: ResizeObserver | undefined

function pinScroll() {
  const el = scroller.value
  if (!el) return
  el.scrollLeft = selected.value === 'last' ? el.scrollWidth : 0
}

watch(
  () => [weeks.value.length, selected.value] as const,
  async () => {
    await nextTick()
    pinScroll()
  },
)

onMounted(() => {
  if (!scroller.value || typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => pinScroll())
  resizeObserver.observe(scroller.value)
})

onUnmounted(() => resizeObserver?.disconnect())

function showTip(event: MouseEvent, text: string) {
  const host = root.value
  const cell = event.currentTarget as HTMLElement
  if (!host) return
  const hostBox = host.getBoundingClientRect()
  const cellBox = cell.getBoundingClientRect()
  const x = cellBox.left - hostBox.left + cellBox.width / 2
  const y = cellBox.top - hostBox.top - 6
  const edge = 110
  let shift = -50
  let left = x
  if (x < edge) {
    left = 8
    shift = 0
  } else if (x > hostBox.width - edge) {
    left = hostBox.width - 8
    shift = -100
  }
  tip.value = { x: left, y, shift, text }
}

function hideTip() {
  tip.value = null
}
</script>

<template>
  <div ref="root" class="contrib" :class="{ 'is-static': reduced }">
    <p v-if="error && !loading && !weeks.length" class="contrib__error">
      {{ error }}
      <a v-if="href" :href="href" target="_blank" rel="noreferrer">Open GitHub ↗</a>
    </p>

    <div v-else class="contrib__shell">
      <div class="contrib__board" :class="{ 'is-switching': switching }">
      <div ref="scroller" class="contrib__scroll">
        <div
          class="contrib__inner"
          :style="{ '--weeks': String(loading ? skeletonWeeks.length : weeks.length) }"
        >
          <div class="contrib__months" aria-hidden="true">
            <span />
            <div class="contrib__month-track">
              <span v-for="(label, index) in loading ? skeletonWeeks.map(() => '') : months" :key="`m-${index}`">
                {{ label }}
              </span>
            </div>
          </div>

          <div class="contrib__grid">
            <div class="contrib__dows" aria-hidden="true">
              <span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span />
            </div>

            <div
              class="contrib__weeks"
              role="img"
              :aria-label="
                loading
                  ? 'Loading GitHub contributions'
                  : `${total.toLocaleString('en-US')} GitHub contributions ${rangeLabel}`
              "
            >
              <template v-if="loading">
                <div v-for="(week, wi) in skeletonWeeks" :key="`s-${wi}`" class="contrib__week">
                  <i v-for="(_, di) in week" :key="di" class="contrib__cell is-l0 is-pulse" />
                </div>
              </template>
              <template v-else>
                <div v-for="(week, wi) in weeks" :key="wi" class="contrib__week">
                  <i
                    v-for="(day, di) in week"
                    :key="`${wi}-${di}`"
                    class="contrib__cell"
                    :class="[
                      `is-l${day.level}`,
                      { 'is-pad': !day.date, 'is-today': day.date === today },
                    ]"
                    :aria-hidden="!day.date"
                    :aria-label="day.date ? contributionLabel(day) : undefined"
                    @mouseenter="day.date && showTip($event, contributionLabel(day))"
                    @mouseleave="hideTip"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>

      </div>

      <p
        v-if="tip"
        class="contrib__tip"
        :style="{ left: `${tip.x}px`, top: `${tip.y}px`, transform: `translate(${tip.shift}%, -100%)` }"
      >
        {{ tip.text }}
      </p>

      <div class="contrib__foot">
        <p>
          <b>{{ loading || switching ? '—' : total.toLocaleString('en-US') }}</b>
          contributions {{ rangeLabel }}
          <a v-if="href" :href="href" target="_blank" rel="noreferrer">@{{ username }}</a>
          <span v-if="error && weeks.length" class="contrib__warn">{{ error }}</span>
        </p>
        <p class="contrib__legend" aria-hidden="true">
          Less
          <i class="contrib__cell is-l0" />
          <i class="contrib__cell is-l1" />
          <i class="contrib__cell is-l2" />
          <i class="contrib__cell is-l3" />
          <i class="contrib__cell is-l4" />
          More
        </p>
      </div>
      </div>

      <nav v-if="years.length" class="contrib__years" aria-label="Contribution year">
        <button
          v-for="year in years"
          :key="year"
          type="button"
          :class="{ 'is-on': isYearOn(year) }"
          :aria-pressed="isYearOn(year)"
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.contrib {
  --cell: 11px;
  --gap: 3px;
  position: relative;
  min-width: 0;
}

.contrib__error {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--muted);
  line-height: 1.6;
}

.contrib__error a {
  margin-left: 0.45rem;
  color: var(--cyan);
}

.contrib__shell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contrib__board {
  display: grid;
  gap: 0.85rem;
  min-width: 0;
  flex: 1;
}

.contrib__board.is-switching {
  opacity: 0.55;
}

.contrib__years {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.contrib__years button {
  padding: 0.38rem 0.7rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.22);
  border-radius: 6px;
  background: rgb(var(--bg-elev-rgb) / 0.6);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--muted);
}

.contrib__years button:hover,
.contrib__years button:focus-visible {
  border-color: var(--cyan);
  color: var(--cyan);
}

.contrib__years button.is-on {
  border-color: var(--olive);
  background: var(--olive);
  color: var(--bg);
}

.contrib__scroll {
  position: relative;
  overflow-x: auto;
  padding-bottom: 0.2rem;
}

.contrib__inner {
  min-width: calc(1.7rem + var(--weeks) * (var(--cell) + var(--gap)));
}

.contrib__months,
.contrib__grid {
  display: grid;
  grid-template-columns: 1.7rem minmax(0, 1fr);
  column-gap: 0.4rem;
}

.contrib__month-track,
.contrib__weeks {
  display: grid;
  grid-template-columns: repeat(var(--weeks), minmax(var(--cell), 1fr));
  gap: var(--gap);
}

.contrib__months {
  margin-bottom: 0.28rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.02em;
  color: var(--muted);
}

.contrib__month-track span {
  overflow: visible;
  white-space: nowrap;
}

.contrib__dows {
  display: grid;
  grid-template-rows: repeat(7, minmax(var(--cell), 1fr));
  gap: var(--gap);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  line-height: var(--cell);
  color: var(--muted);
}

.contrib__week {
  display: grid;
  grid-template-rows: repeat(7, minmax(var(--cell), 1fr));
  gap: var(--gap);
}

.contrib__cell {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 2px;
  font-style: normal;
  background: rgb(var(--text-rgb) / 0.08);
}

.contrib__cell.is-l1 {
  background: rgb(var(--cyan-rgb) / 0.28);
}

.contrib__cell.is-l2 {
  background: rgb(var(--cyan-rgb) / 0.52);
}

.contrib__cell.is-l3 {
  background: rgb(var(--cyan-rgb) / 0.78);
}

.contrib__cell.is-l4 {
  background: var(--cyan);
}

.contrib__cell.is-pad {
  background: transparent;
}

.contrib__cell.is-today {
  box-shadow: 0 0 0 1px var(--olive);
}

.contrib__cell:not(.is-pad):not(.is-pulse):hover {
  outline: 1px solid var(--text);
  outline-offset: 0;
}

.contrib__cell.is-pulse {
  animation: pulse 1.4s ease-in-out infinite;
}

.contrib.is-static .contrib__cell.is-pulse {
  animation: none;
}

.contrib__tip {
  position: absolute;
  z-index: 3;
  padding: 0.28rem 0.5rem;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  background: var(--bg-elev);
  box-shadow: var(--glow-cyan);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  color: var(--text);
  white-space: nowrap;
  pointer-events: none;
}

.contrib__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem 1rem;
}

.contrib__foot p {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--muted);
}

.contrib__foot b {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text);
}

.contrib__foot a {
  color: var(--cyan);
}

.contrib__warn {
  margin-left: 0.45rem;
  color: var(--olive);
}

.contrib__legend {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
}

.contrib__legend .contrib__cell {
  width: 0.68rem;
  min-width: 0.68rem;
}

@keyframes pulse {
  50% {
    opacity: 0.45;
  }
}

@media (min-width: 800px) {
  .contrib {
    --cell: 12px;
  }

  .contrib__shell {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.1rem;
  }

  .contrib__years {
    flex-direction: column;
    flex-shrink: 0;
    width: 5.6rem;
    max-height: 18rem;
    overflow-y: auto;
  }

  .contrib__years button {
    width: 100%;
    text-align: left;
  }
}
</style>
