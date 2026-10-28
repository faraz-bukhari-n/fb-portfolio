<script setup lang="ts">
import TagChip from '@/components/ui/TagChip.vue'
import type { ExperienceRole } from '@/content'

defineProps<{
  roles: ExperienceRole[]
  activeId?: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <ol class="timeline">
    <li v-for="role in roles" :key="role.id">
      <button
        type="button"
        class="timeline__node"
        :class="{ 'is-open': activeId === role.id }"
        @click="emit('select', role.id)"
      >
        <span class="timeline__dot" />
        <div>
          <p class="kicker">{{ role.start }} — {{ role.end }} · {{ role.location }}</p>
          <h3>{{ role.title }}</h3>
          <p class="timeline__org">{{ role.org }}</p>
        </div>
      </button>
      <div class="timeline__body" :class="{ 'is-open': activeId === role.id }">
        <p class="timeline__summary">{{ role.summary }}</p>
        <ul>
          <li v-for="bullet in role.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
        <div class="timeline__tags">
          <TagChip v-for="item in role.stack" :key="item" :label="item" />
        </div>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0 0 0 0.4rem;
  border-left: 1px solid var(--line);
}

.timeline > li + li {
  margin-top: 1.15rem;
}

.timeline__node {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  padding: 0.85rem 0.4rem 0.85rem 0;
  color: inherit;
}

.timeline__node .kicker {
  letter-spacing: 0.1em;
}

h3 {
  margin: 0.2rem 0 0.15rem;
  font-size: clamp(1.1rem, 4vw, 1.35rem);
  letter-spacing: -0.03em;
}

.timeline__body {
  padding: 0 0 1.1rem 1.15rem;
  min-width: 0;
}

.timeline__dot {
  width: 9px;
  height: 9px;
  margin-left: -0.7rem;
  margin-top: 0.45rem;
  border-radius: 99px;
  background: var(--bg);
  border: 1px solid var(--magenta);
  box-shadow: 0 0 0 4px var(--bg);
}

.is-open .timeline__dot {
  background: var(--olive);
  border-color: var(--olive);
  box-shadow: 0 0 0 4px var(--bg);
}

.timeline__org {
  margin: 0;
  color: var(--muted);
}

.timeline__summary {
  margin: 0 0 0.7rem;
  color: var(--text);
  line-height: 1.55;
}

.timeline__body li {
  color: var(--muted);
  line-height: 1.6;
}

.timeline__body ul {
  margin: 0;
  padding-left: 1.1rem;
}

.timeline__body li + li {
  margin-top: 0.45rem;
}

.timeline__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.8rem;
}
</style>
