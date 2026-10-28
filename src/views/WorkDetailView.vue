<script setup lang="ts">
import GlowButton from '@/components/ui/GlowButton.vue'
import PageFrame from '@/components/ui/PageFrame.vue'
import TagChip from '@/components/ui/TagChip.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { projectBySlug } from '@/content'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const project = computed(() => projectBySlug(String(route.params.slug)))
usePageTitle(computed(() => project.value?.title ?? 'Work'))
</script>

<template>
  <PageFrame>
    <template v-if="project">
      <p class="kicker">{{ project.year }} · {{ project.role }}</p>
      <TerminalHeading>{{ project.title }}</TerminalHeading>
      <p class="lede">{{ project.summary }}</p>
      <div class="tags">
        <TagChip v-for="item in project.stack" :key="item" :label="item" />
      </div>

      <div class="case-grid">
        <section>
          <h2>Problem</h2>
          <p>{{ project.problem }}</p>
        </section>
        <section>
          <h2>Approach</h2>
          <p>{{ project.approach }}</p>
        </section>
        <section>
          <h2>Outcome</h2>
          <p>{{ project.outcome }}</p>
        </section>
      </div>

      <section class="arch">
        <h2>Architecture</h2>
        <ol>
          <li v-for="(node, index) in project.architecture" :key="node.id">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            {{ node.label }}
            <i v-if="index < project.architecture.length - 1" aria-hidden="true">→</i>
          </li>
        </ol>
      </section>

      <div class="case-cta">
        <GlowButton v-if="project.href" :href="project.href">Live product</GlowButton>
        <GlowButton to="/work" variant="ghost">← All work</GlowButton>
      </div>
    </template>
    <template v-else>
      <TerminalHeading>Not found</TerminalHeading>
      <p class="muted">No case study for this slug.</p>
      <GlowButton to="/work">Back to work</GlowButton>
    </template>
  </PageFrame>
</template>

<style scoped>
.lede {
  max-width: 44rem;
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.65;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 1.2rem 0 2.4rem;
}

.case-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  margin-bottom: 2.4rem;
}

h2 {
  margin: 0 0 0.6rem;
  font-size: 0.82rem;
  font-family: var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--cyan);
}

section p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.arch {
  margin-bottom: 2.2rem;
}

.arch ol {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 0;
  margin: 0;
}

.arch li {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  background: var(--bg-elev);
}

.arch span {
  font-family: var(--font-mono);
  color: var(--magenta);
  font-size: 0.75rem;
}

.arch i {
  color: var(--cyan);
  font-style: normal;
  margin-left: 0.15rem;
}

.case-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

@media (min-width: 800px) {
  .case-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
