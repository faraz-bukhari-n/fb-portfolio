<script setup lang="ts">
import PageFrame from '@/components/ui/PageFrame.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import HighlightCard from '@/components/viz/HighlightCard.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { highlights } from '@/content'

usePageTitle('Career highlights')
</script>

<template>
  <PageFrame>
    <TerminalHeading index="03" kicker="$ cat highlights.md">Career highlights</TerminalHeading>
    <p class="lede">
      The work that changed the number: users, inventory, a live URL. Roles and case studies sit on Experience and Work.
    </p>
    <div class="grid">
      <HighlightCard v-for="item in highlights" :key="item.id" :highlight="item" detailed />
    </div>
  </PageFrame>
</template>

<style scoped>
.lede {
  max-width: 40rem;
  margin: 0 0 2rem;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}

@media (min-width: 720px) {
  .lede {
    font-size: 1.15rem;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
