<script setup lang="ts">
import CaseCard from '@/components/ui/CaseCard.vue'
import PageFrame from '@/components/ui/PageFrame.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { categoryLabel, projects, type ProjectCategory } from '@/content'
import { computed, ref } from 'vue'

usePageTitle('Work')

const filters: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'gis', label: categoryLabel.gis },
  { id: 'platform', label: categoryLabel.platform },
  { id: 'lead', label: categoryLabel.lead },
  { id: 'fullstack', label: categoryLabel.fullstack },
]

const active = ref<(typeof filters)[number]['id']>('all')

const visible = computed(() => {
  if (active.value === 'all') return projects
  return projects.filter((project) => project.categories.includes(active.value as ProjectCategory))
})
</script>

<template>
  <PageFrame>
    <TerminalHeading index="03" kicker="archive">Work</TerminalHeading>
    <div class="filters" role="tablist" aria-label="Filter projects">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        role="tab"
        :aria-selected="active === filter.id"
        :class="{ 'is-on': active === filter.id }"
        @click="active = filter.id"
      >
        {{ filter.label }}
      </button>
    </div>
    <div class="grid">
      <CaseCard v-for="project in visible" :key="project.slug" :project="project" />
    </div>
  </PageFrame>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.6rem;
}

.filters button {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--line);
  color: var(--muted);
}

.filters button.is-on {
  color: var(--bg);
  background: var(--text);
  border-color: var(--text);
  box-shadow: none;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
</style>
