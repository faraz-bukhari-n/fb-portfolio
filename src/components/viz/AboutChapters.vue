<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'
import type { AboutChapter } from '@/content'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  chapters: AboutChapter[]
}>()

const active = ref(props.chapters[0]?.id ?? '')
let triggers: ScrollTrigger[] = []

onMounted(() => {
  props.chapters.forEach((chapter) => {
    const el = document.querySelector(`#chapter-${chapter.id}`)
    if (!el) return
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => {
        active.value = chapter.id
      },
      onEnterBack: () => {
        active.value = chapter.id
      },
    })
    triggers.push(trigger)
  })
})

onUnmounted(() => {
  triggers.forEach((trigger) => trigger.kill())
  triggers = []
})
</script>

<template>
  <div class="about-layout">
    <aside class="about-rail" aria-label="Chapters">
      <a
        v-for="chapter in chapters"
        :key="chapter.id"
        :href="`#chapter-${chapter.id}`"
        :class="{ 'is-active': active === chapter.id }"
      >
        <span>{{ chapter.index }}</span>
        {{ chapter.title }}
      </a>
    </aside>
    <div class="about-chapters">
      <article
        v-for="chapter in chapters"
        :id="`chapter-${chapter.id}`"
        :key="chapter.id"
        class="about-chapter"
      >
        <p class="kicker">{{ chapter.yearLabel }} · {{ chapter.location }}</p>
        <h2>{{ chapter.title }}</h2>
        <p>{{ chapter.body }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.about-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  min-width: 0;
}

.about-rail {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.about-rail a {
  display: flex;
  gap: 0.7rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0.35rem 0.8rem 0.35rem 0;
  border-bottom: 1px solid var(--line);
}

.about-rail a.is-active {
  color: var(--cyan);
  border-color: var(--cyan);
}

.about-chapter {
  padding: 0.4rem 0 1.6rem;
  border-bottom: 1px solid var(--line);
}

h2 {
  margin: 0.4rem 0 1rem;
  font-size: clamp(1.7rem, 7vw, 3rem);
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.about-chapter > p:last-child {
  max-width: 42rem;
  color: var(--muted);
  font-size: 1.12rem;
  line-height: 1.75;
}

@media (min-width: 800px) {
  .about-layout {
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 2.5rem;
  }

  .about-rail {
    position: sticky;
    top: calc(var(--nav-h) + 1.5rem);
    align-self: start;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .about-rail a {
    border-bottom: 0;
    border-left: 1px solid var(--line);
    padding: 0.35rem 0 0.35rem 0.8rem;
  }
}
</style>
