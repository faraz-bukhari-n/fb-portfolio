<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: 'solid' | 'ghost' | 'magenta'
  }>(),
  { variant: 'solid' },
)

const classes = computed(() => ['glow-btn', `glow-btn--${props.variant}`])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <a
    v-else-if="href"
    :href="href"
    :class="classes"
    :target="href.startsWith('http') ? '_blank' : undefined"
    :rel="href.startsWith('http') ? 'noreferrer' : undefined"
  >
    <slot />
  </a>
  <button v-else type="button" :class="classes">
    <slot />
  </button>
</template>

<style scoped>
.glow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.05rem;
  border: 1px solid var(--text);
  border-radius: 999px;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  transition:
    background 0.45s var(--ease),
    color 0.45s var(--ease),
    border-color 0.45s var(--ease),
    transform 0.45s var(--ease);
}

.glow-btn:hover {
  transform: translateY(-2px);
}

.glow-btn--solid {
  background: var(--text);
  color: var(--bg);
}

.glow-btn--solid:hover {
  background: var(--olive);
  border-color: var(--olive);
}

.glow-btn--ghost {
  background: transparent;
  color: var(--text);
  border-color: var(--line-strong);
}

.glow-btn--ghost:hover {
  border-color: var(--text);
}

.glow-btn--magenta {
  border-color: var(--earth);
  color: var(--earth);
  background: transparent;
}

.glow-btn--magenta:hover {
  background: var(--earth);
  color: var(--bg);
}
</style>
