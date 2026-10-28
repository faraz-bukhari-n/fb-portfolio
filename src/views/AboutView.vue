<script setup lang="ts">
import AboutChapters from '@/components/viz/AboutChapters.vue'
import PageFrame from '@/components/ui/PageFrame.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { aboutChapters, identity } from '@/content'

usePageTitle('About')
</script>

<template>
  <PageFrame>
    <TerminalHeading index="01" kicker="$ whoami">About</TerminalHeading>
    <p class="lede">{{ identity.summary }}</p>
    <AboutChapters :chapters="aboutChapters" />
  </PageFrame>
</template>

<style scoped>
.lede {
  max-width: 40rem;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0 0 2.5rem;
}

@media (min-width: 720px) {
  .lede {
    font-size: 1.15rem;
  }
}
</style>
