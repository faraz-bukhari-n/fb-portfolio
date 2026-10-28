<script setup lang="ts">
import { identity } from '@/content'

defineProps<{
  compact?: boolean
}>()
</script>

<template>
  <footer class="site-footer">
    <div class="page-shell site-footer__row">
      <p class="kicker">{{ identity.shortName }} // {{ identity.location }}</p>
      <p class="muted">{{ compact ? identity.email : '© 2026 · Vue 3 · Vite' }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--line);
  padding: 1.25rem var(--page-pad) 1.6rem;
  background: transparent;
}

.site-footer__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

p {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
</style>
