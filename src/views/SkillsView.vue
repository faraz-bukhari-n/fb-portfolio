<script setup lang="ts">
import PageFrame from '@/components/ui/PageFrame.vue'
import TagChip from '@/components/ui/TagChip.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import SkillConstellation from '@/components/viz/SkillConstellation.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { projectBySlug, skillGroupColor, skillGroupLabel, skills, type Skill } from '@/content'
import { ref } from 'vue'

usePageTitle('Skills')
const selected = ref<Skill>(skills[0])
</script>

<template>
  <PageFrame wide>
    <TerminalHeading index="04" kicker="graph">Skills</TerminalHeading>
    <p class="lede">Scroll to zoom, drag to pan, click a node. Groups: full-stack, webGIS, leadership, cloud / DevEx.</p>
    <div class="skills-grid">
      <SkillConstellation :selected-id="selected.id" @select="selected = $event" />
      <aside class="panel">
        <p class="kicker" :style="{ color: skillGroupColor[selected.group] }">
          {{ skillGroupLabel[selected.group] }}
        </p>
        <h2>{{ selected.name }}</h2>
        <p>{{ selected.blurb }}</p>
        <p class="meta">{{ selected.years }} yrs · level {{ selected.level }} / 5</p>
        <h3 v-if="selected.relatedProjects.length">Used in</h3>
        <div v-if="selected.relatedProjects.length" class="tags">
          <RouterLink
            v-for="slug in selected.relatedProjects"
            :key="slug"
            :to="`/work/${slug}`"
          >
            <TagChip :label="projectBySlug(slug)?.title ?? slug" />
          </RouterLink>
        </div>
      </aside>
    </div>
  </PageFrame>
</template>

<style scoped>
.lede {
  color: var(--muted);
  margin: 0 0 1.5rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  align-items: start;
  min-width: 0;
}

.panel {
  border: 1px solid var(--line);
  padding: 1.2rem 1.25rem;
  background: var(--bg-elev);
  min-width: 0;
}

h2 {
  margin: 0.3rem 0 0.7rem;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.panel p {
  color: var(--muted);
  line-height: 1.6;
}

.meta {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--cyan) !important;
}

h3 {
  margin: 1.2rem 0 0.5rem;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--magenta);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

@media (min-width: 900px) {
  .skills-grid {
    grid-template-columns: minmax(0, 1.5fr) minmax(240px, 0.7fr);
  }

  .panel {
    position: sticky;
    top: calc(var(--nav-h) + 1rem);
  }
}
</style>
