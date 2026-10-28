<script setup lang="ts">
defineProps<{
  index?: string
  kicker?: string
}>()
</script>

<template>
  <header class="terminal-heading">
    <p v-if="kicker || index" class="kicker">
      <span class="prompt">&gt;_</span>
      <span v-if="index">{{ index }}</span>
      <span v-if="kicker">{{ kicker }}</span>
    </p>
    <h1><slot /></h1>
  </header>
</template>

<style scoped>
.terminal-heading {
  margin: 0 0 2rem;
}

.kicker {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  margin: 0 0 0.7rem;
  text-transform: none;
  letter-spacing: 0.04em;
  font-size: 0.82rem;
}

.prompt {
  color: var(--earth);
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 8vw, 3.8rem);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 1.05;
  overflow-wrap: break-word;
}
</style>
