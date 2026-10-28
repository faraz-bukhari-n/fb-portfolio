<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  { label: 'View details' },
)
</script>

<template>
  <span class="card-go">
    {{ label }}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  </span>
</template>

<style scoped>
.card-go {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--olive);
  transition: color 0.35s var(--ease);
}

svg {
  width: 0.9rem;
  height: 0.9rem;
  transition: transform 0.35s var(--ease);
}

@media (prefers-reduced-motion: reduce) {
  svg {
    transition: none;
  }
}
</style>
