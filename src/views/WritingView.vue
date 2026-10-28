<script setup lang="ts">
import PageFrame from '@/components/ui/PageFrame.vue'
import TagChip from '@/components/ui/TagChip.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { articles } from '@/content'

usePageTitle('Writing')
</script>

<template>
  <PageFrame>
    <TerminalHeading index="05" kicker="$ ls ~/writing">Writing</TerminalHeading>
    <p v-if="!articles.length" class="empty">No essays published yet.</p>
    <div v-else class="writing-list">
      <RouterLink v-for="article in articles" :key="article.slug" :to="`/writing/${article.slug}`" class="article-card">
        <p class="kicker">{{ article.date }}</p>
        <h2>{{ article.title }}</h2>
        <p>{{ article.summary }}</p>
        <div class="tags">
          <TagChip v-for="tag in article.tags" :key="tag" :label="tag" />
        </div>
      </RouterLink>
    </div>
  </PageFrame>
</template>

<style scoped>
.empty {
  color: var(--muted);
  margin: 0.5rem 0 0;
}

.writing-list {
  display: grid;
  gap: 0.85rem;
}

.article-card {
  display: grid;
  gap: 0.45rem;
  padding: 1.2rem 1.3rem;
  border: 1px solid var(--line);
  background: var(--bg-elev);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.article-card:hover {
  border-color: var(--earth);
  box-shadow: var(--glow-cyan);
}

h2 {
  margin: 0;
  font-size: 1.45rem;
  letter-spacing: -0.03em;
}

.article-card > p:not(.kicker) {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.3rem;
}
</style>
