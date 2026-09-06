<script setup lang="ts">
import TagChip from './TagChip.vue'
import { categoryLabel, type Project } from '@/content'

defineProps<{
  project: Project
}>()
</script>

<template>
  <RouterLink :to="`/work/${project.slug}`" class="case-card">
    <div class="case-card__meta">
      <span>{{ project.year }}</span>
      <span>{{ project.role.split('·')[0] }}</span>
    </div>
    <h3>{{ project.title }}</h3>
    <p>{{ project.summary }}</p>
    <div class="case-card__tags">
      <TagChip v-for="category in project.categories" :key="category" :label="categoryLabel[category]" />
    </div>
  </RouterLink>
</template>

<style scoped>
.case-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.1rem 1.05rem 1.2rem;
  border: 1px solid var(--line);
  background: var(--bg-elev);
  border-radius: var(--radius);
  min-width: 0;
  transition:
    border-color 0.45s var(--ease),
    box-shadow 0.45s var(--ease),
    transform 0.45s var(--ease);
}

.case-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
  font-family: var(--font-sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--magenta);
  font-size: 0.72rem;
}

h3 {
  margin: 0;
  font-size: clamp(1.15rem, 4vw, 1.35rem);
  letter-spacing: -0.03em;
}

.case-card:hover {
  border-color: var(--earth);
  box-shadow: var(--glow-cyan);
  transform: translateY(-6px);
}

p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
  flex: 1;
}

.case-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
