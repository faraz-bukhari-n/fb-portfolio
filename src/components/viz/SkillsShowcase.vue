<script setup lang="ts">
import SkillGlobe from '@/components/viz/SkillGlobe.vue'
import SkillInspectModal from '@/components/viz/SkillInspectModal.vue'
import { skillByLabel, type Skill } from '@/content'
import { computed, ref } from 'vue'

const tree = [
  { label: 'Programming Languages', items: ['JavaScript', 'Python', 'SQL'] },
  {
    label: 'Web Technologies',
    items: ['HTML / CSS / SCSS', 'Tailwind', 'Styled components', 'Bootstrap Tables'],
  },
  {
    label: 'Frameworks',
    items: ['ReactJS', 'Context API / Redux / Axios', 'NodeJS', 'Express', 'Sequelize', 'REST APIs'],
  },
  { label: 'Maps', items: ['MapboxGL', 'Leaflet', 'CesiumJS', 'Turf JS'] },
  { label: 'Databases', items: ['MySQL', 'PostgreSQL / PostGIS', 'Redis', 'Firebase / Firestore'] },
  {
    label: 'Backend & services',
    items: [
      'Socket.io',
      'Temporal.io',
      'Bull Queues',
      'AWS SDK',
      'Mailgun',
      'Handlebars',
      'Directus',
      'Puppeteer',
      'Webpack / Babel',
      'Bit Dev',
    ],
  },
  {
    label: 'AI',
    items: ['AWS Bedrock', 'Claude Haiku', 'AWS Rekognition', 'OpenAI'],
  },
  {
    label: 'GIS methods',
    items: [
      'Spatial Data Preprocessing',
      'Georeferencing',
      'Raster handling',
      'Vector handling',
      'Spatial Analysis',
      'FME / ETL',
    ],
  },
  {
    label: 'Software',
    items: ['Git', 'GitHub', 'VS Code', 'ArcGIS / QGIS / ERDAS Imagine', 'Postman', 'Jira / Confluence / Slack / Airtable'],
  },
  {
    label: 'Leadership',
    items: ['Team lead', 'Delivery'],
  },
]

const inspected = ref<Skill | null>(null)

const queue = computed(() => {
  const seen = new Set<string>()
  const list: Skill[] = []
  for (const entry of tree) {
    for (const item of entry.items) {
      const skill = skillByLabel(item)
      if (!skill || seen.has(skill.id)) continue
      seen.add(skill.id)
      list.push(skill)
    }
  }
  return list
})

function openSkill(label: string) {
  inspected.value = skillByLabel(label) ?? null
}

function isOn(label: string) {
  return inspected.value?.id === skillByLabel(label)?.id
}
</script>

<template>
  <div class="showcase">
    <div class="showcase__universe">
      <div class="showcase__globe">
        <SkillGlobe @select="openSkill" />
        <p class="showcase__hint">
          <span aria-hidden="true">&gt;</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
          Drag to explore · click to inspect
        </p>
      </div>
    </div>

    <aside class="showcase__tree" aria-label="Skill tree">
      <p class="showcase__prompt">
        <span>skill_tree.json</span>
        <span>—</span>
        <em>$</em>
        <b>cat languages.json</b>
      </p>
      <div class="showcase__groups">
        <section v-for="entry in tree" :key="entry.label">
          <h3>"{{ entry.label }}"</h3>
          <div>
            <button
              v-for="item in entry.items"
              :key="item"
              type="button"
              :class="{ 'is-on': isOn(item) }"
              @click="openSkill(item)"
            >
              {{ item }}
            </button>
          </div>
        </section>
      </div>
    </aside>

    <Teleport to="body">
      <Transition name="inspect">
        <SkillInspectModal
          v-if="inspected"
          :skill="inspected"
          :queue="queue"
          @close="inspected = null"
          @select="inspected = $event"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.showcase__universe,
.showcase__tree {
  width: 100%;
  min-width: 0;
}

.showcase__universe {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.showcase__globe {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  margin-inline: auto;
}

.showcase__hint {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem auto 0;
  padding: 0.38rem 1rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.25);
  border-radius: 999px;
  background: rgb(var(--olive-rgb) / 0.06);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--text);
  white-space: nowrap;
}

.showcase__hint > span {
  color: var(--olive);
}

.showcase__hint svg {
  width: 12px;
  height: 12px;
  stroke: var(--olive);
  stroke-width: 1.8;
  stroke-linecap: round;
}

.showcase__tree {
  padding: 1.25rem;
  border: 1px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(rgb(var(--bg-elev-rgb)), rgb(var(--bg-elev-rgb))) padding-box,
    linear-gradient(135deg, rgb(var(--olive-rgb) / 0.6), rgb(var(--olive-rgb) / 0.1), rgb(var(--olive-rgb) / 0.5))
      border-box;
}

.showcase__prompt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--muted);
}

.showcase__prompt em {
  font-style: normal;
  color: var(--cyan);
}

.showcase__prompt b {
  font-weight: 500;
  color: var(--olive);
}

.showcase__groups {
  display: grid;
  gap: 0.75rem;
}

.showcase__groups section {
  transition: transform 300ms ease;
}

.showcase__groups section:hover {
  transform: translateX(4px);
}

.showcase__groups h3 {
  margin: 0 0 0.25rem;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.showcase__groups section > div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.38rem;
}

.showcase__groups button {
  position: relative;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.2);
  border-radius: 4px;
  background: rgb(var(--olive-rgb) / 0.05);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--olive);
  cursor: pointer;
  user-select: none;
  transition:
    transform 300ms ease,
    background 200ms ease,
    color 200ms ease;
}

.showcase__groups button:hover {
  z-index: 1;
  transform: scale(1.1);
}

.showcase__groups button.is-on {
  background: var(--olive);
  color: var(--bg);
}

@media (min-width: 1024px) {
  .showcase {
    flex-direction: row;
    align-items: center;
    gap: 3rem;
  }

  .showcase__universe,
  .showcase__tree {
    flex: 1;
  }
}

</style>

<style>
.inspect-enter-active,
.inspect-leave-active {
  transition: opacity 180ms ease;
}

.inspect-enter-active .inspect__card,
.inspect-leave-active .inspect__card {
  transition: transform 180ms ease;
}

.inspect-enter-from,
.inspect-leave-to {
  opacity: 0;
}

.inspect-enter-from .inspect__card,
.inspect-leave-to .inspect__card {
  transform: translateY(8px) scale(0.98);
}
</style>
