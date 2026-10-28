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
  padding: 0.18rem 0.48rem;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: rgb(var(--bg-rgb) / 0.45);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}
</style>
