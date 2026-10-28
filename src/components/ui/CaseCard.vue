<script setup lang="ts">
import TagChip from './TagChip.vue'
import { categoryLabel, type Project } from '@/content'

defineProps<{
  project: Project
}>()
</script>

<template>
  <RouterLink :to="`/work/${project.slug}`" class="case-card">
    <div class="case-card__bar">
      <span class="case-card__dots" aria-hidden="true"><i /><i /><i /></span>
      <span>work/{{ project.slug }}.md</span>
    </div>
    <div class="case-card__body">
      <div class="case-card__meta">
        <span>{{ project.year }}</span>
        <span>{{ project.role.split('·')[0] }}</span>
      </div>
      <h3>{{ project.title }}</h3>
      <p>{{ project.summary }}</p>
      <div class="case-card__tags">
        <TagChip v-for="category in project.categories" :key="category" :label="categoryLabel[category]" />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.case-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: 14px;
  background:
    linear-gradient(rgb(var(--bg-elev-rgb) / 0.92), rgb(var(--bg-elev-rgb) / 0.92)) padding-box,
    linear-gradient(120deg, rgb(var(--olive-rgb) / 0.4), rgb(var(--cyan-rgb) / 0.4)) border-box;
  overflow: hidden;
  transition:
    transform 0.35s var(--ease),
    box-shadow 0.35s var(--ease);
}

.case-card__bar {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.9rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.case-card__dots {
  display: flex;
  gap: 0.28rem;
}

.case-card__dots i {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: var(--dot-red);
}

.case-card__dots i:nth-child(2) {
  background: var(--dot-gold);
}

.case-card__dots i:nth-child(3) {
  background: var(--dot-green);
}

.case-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.05rem 1.1rem 1.2rem;
}

.case-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--olive);
  font-size: 0.68rem;
}

h3 {
  margin: 0;
  font-size: clamp(1.15rem, 4vw, 1.4rem);
  letter-spacing: -0.04em;
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glow-cyan);
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
