<script setup lang="ts">
defineProps<{
  index?: string
  kicker?: string
}>()
</script>

<template>
  <header class="terminal-heading">
    <p v-if="kicker || index" class="kicker">
      <span v-if="index">{{ index }}</span>
      <span v-if="kicker">{{ kicker }}</span>
    </p>
    <h1><slot /></h1>
  </header>
</template>

<style scoped>
.terminal-heading {
  margin: 0 0 1.75rem;
}

.kicker {
  display: flex;
  gap: 1rem;
  margin: 0 0 0.65rem;
}

h1 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.85rem, 8vw, 3.8rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.12;
  overflow-wrap: break-word;
}
</style>
