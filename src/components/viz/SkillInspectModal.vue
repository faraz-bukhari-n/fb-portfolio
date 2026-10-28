<script setup lang="ts">
import TagChip from '@/components/ui/TagChip.vue'
import WindowPane from '@/components/ui/WindowPane.vue'
import { projectBySlug, skillGroupColor, skillGroupLabel, type Skill } from '@/content'
import { onKeyStroke } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  skill: Skill
  queue: Skill[]
}>()

const emit = defineEmits<{
  close: []
  select: [skill: Skill]
}>()

const closeBtn = ref<HTMLButtonElement | null>(null)

const index = computed(() => {
  const found = props.queue.findIndex((item) => item.id === props.skill.id)
  return found >= 0 ? found : 0
})

const total = computed(() => Math.max(props.queue.length, 1))
const position = computed(() => `${String(index.value + 1).padStart(2, '0')} / ${String(total.value).padStart(2, '0')}`)
const prevSkill = computed(() => props.queue[(index.value - 1 + props.queue.length) % props.queue.length])
const nextSkill = computed(() => props.queue[(index.value + 1) % props.queue.length])

function close() {
  emit('close')
}

function go(skill: Skill | undefined) {
  if (skill && skill.id !== props.skill.id) emit('select', skill)
}

onKeyStroke('Escape', close)
onKeyStroke('ArrowLeft', (event) => {
  event.preventDefault()
  go(prevSkill.value)
})
onKeyStroke('ArrowRight', (event) => {
  event.preventDefault()
  go(nextSkill.value)
})

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  nextTick(() => closeBtn.value?.focus())
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="inspect" @wheel.prevent>
    <button class="inspect__scrim" type="button" tabindex="-1" aria-label="Close inspect" @click="close" />
    <button
      class="inspect__step is-prev"
      type="button"
      :aria-label="`Previous skill, ${prevSkill?.name ?? ''}`"
      @click.stop="go(prevSkill)"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6 9 12l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div
      class="inspect__card"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`inspect-${skill.id}`"
    >
      <WindowPane :title="`${skill.name}.md`" prompt="$ inspect">
        <div class="inspect__top">
          <p class="inspect__kicker" :style="{ color: skillGroupColor[skill.group] }">
            {{ skillGroupLabel[skill.group] }}
          </p>
          <p class="inspect__pos">{{ position }}</p>
          <button ref="closeBtn" class="inspect__close" type="button" @click="close">esc</button>
        </div>
        <h2 :id="`inspect-${skill.id}`">{{ skill.name }}</h2>
        <p class="inspect__blurb">{{ skill.blurb }}</p>
        <p class="inspect__meta">{{ skill.years }} yrs · level {{ skill.level }} / 5</p>
        <h3 v-if="skill.relatedProjects.length">Used in</h3>
        <div v-if="skill.relatedProjects.length" class="inspect__tags">
          <RouterLink
            v-for="slug in skill.relatedProjects"
            :key="slug"
            :to="`/work/${slug}`"
            @click="close"
          >
            <TagChip :label="projectBySlug(slug)?.title ?? slug" />
          </RouterLink>
        </div>
        <div class="inspect__pager">
          <button type="button" @click.stop="go(prevSkill)">
            <span aria-hidden="true">←</span>
            {{ prevSkill?.name }}
          </button>
          <button type="button" @click.stop="go(nextSkill)">
            {{ nextSkill?.name }}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </WindowPane>
    </div>
    <button
      class="inspect__step is-next"
      type="button"
      :aria-label="`Next skill, ${nextSkill?.name ?? ''}`"
      @click.stop="go(nextSkill)"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.inspect {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  grid-template-columns: auto minmax(0, 28rem) auto;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 1.25rem;
}

.inspect__scrim {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(var(--bg-rgb) / 0.62);
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.inspect__card {
  position: relative;
  z-index: 1;
  grid-column: 2;
  width: min(28rem, 100%);
  min-width: 0;
}

.inspect__step {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.35);
  border-radius: 999px;
  background: rgb(var(--bg-elev-rgb) / 0.92);
  color: var(--olive);
  box-shadow: var(--glow-magenta);
}

.inspect__step:hover,
.inspect__step:focus-visible {
  border-color: var(--cyan);
  color: var(--cyan);
}

.inspect__step svg {
  width: 1.15rem;
  height: 1.15rem;
}

.inspect__top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.15rem;
}

.inspect__pos {
  margin: 0 0 0 auto;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--muted);
  white-space: nowrap;
}

.inspect__close {
  flex-shrink: 0;
  padding: 0.15rem 0.4rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.28);
  border-radius: 4px;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.inspect__close:hover,
.inspect__close:focus-visible {
  border-color: var(--cyan);
  color: var(--cyan);
}

.inspect__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.inspect__card h2 {
  margin: 0.3rem 0 0.7rem;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.inspect__blurb {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.inspect__meta {
  margin: 0.85rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--cyan);
}

.inspect__card h3 {
  margin: 1.2rem 0 0.5rem;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--magenta);
}

.inspect__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.inspect__pager {
  display: flex;
  justify-content: space-between;
  gap: 0.7rem;
  margin-top: 1.2rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--line);
}

.inspect__pager button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--olive);
  text-align: left;
}

.inspect__pager button:last-child {
  margin-left: auto;
  text-align: right;
}

.inspect__pager button:hover,
.inspect__pager button:focus-visible {
  color: var(--cyan);
}

@media (max-width: 640px) {
  .inspect {
    grid-template-columns: minmax(0, 28rem);
    justify-items: center;
  }

  .inspect__card {
    grid-column: 1;
  }

  .inspect__step {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .inspect__step.is-prev {
    left: 0.35rem;
  }

  .inspect__step.is-next {
    right: 0.35rem;
  }
}
</style>
