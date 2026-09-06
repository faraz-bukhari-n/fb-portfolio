<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <span class="tag-chip"><slot>{{ label }}</slot></span>
</template>

<style scoped>
.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.5rem;
  border: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
</style>
