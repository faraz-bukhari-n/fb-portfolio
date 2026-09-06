<script setup lang="ts">
import GlowButton from '@/components/ui/GlowButton.vue'
import PageFrame from '@/components/ui/PageFrame.vue'
import TagChip from '@/components/ui/TagChip.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { articleBySlug } from '@/content'
import { renderMarkdown } from '@/lib/markdown'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const article = computed(() => articleBySlug(String(route.params.slug)))
const html = computed(() => (article.value ? renderMarkdown(article.value.body) : ''))
usePageTitle(computed(() => article.value?.title ?? 'Writing'))
</script>

<template>
  <PageFrame>
    <template v-if="article">
      <p class="kicker">{{ article.date }}</p>
      <TerminalHeading>{{ article.title }}</TerminalHeading>
      <div class="tags">
        <TagChip v-for="tag in article.tags" :key="tag" :label="tag" />
      </div>
      <article class="md-body" v-html="html" />
      <GlowButton to="/writing" variant="ghost">← Writing</GlowButton>
    </template>
    <template v-else>
      <TerminalHeading>Not found</TerminalHeading>
      <GlowButton to="/writing">Back to writing</GlowButton>
    </template>
  </PageFrame>
</template>

<style scoped>
.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 1.6rem;
}

.md-body {
  max-width: 42rem;
  margin-bottom: 2rem;
}
</style>
