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
  padding: 0.72rem 1.15rem;
  border: 1px solid var(--text);
  border-radius: 8px;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  transition:
    background 0.35s var(--ease),
    color 0.35s var(--ease),
    border-color 0.35s var(--ease),
    box-shadow 0.35s var(--ease),
    transform 0.35s var(--ease);
}

.glow-btn:hover {
  transform: translateY(-2px);
}

.glow-btn--solid {
  background: var(--text);
  color: var(--bg);
}

.glow-btn--solid:hover {
  background: var(--cyan);
  border-color: var(--cyan);
  color: var(--bg);
  box-shadow: var(--glow-cyan);
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
  border-color: var(--magenta);
  color: var(--magenta);
  background: transparent;
}

.glow-btn--magenta:hover {
  background: var(--magenta);
  color: var(--bg);
}
</style>
