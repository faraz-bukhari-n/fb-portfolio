<script setup lang="ts">
import { useTheme, type ThemePreference } from '@/composables/useTheme'

const { preference, setPreference } = useTheme()

const options: { id: ThemePreference; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
]
</script>

<template>
  <div class="theme-toggle" role="radiogroup" aria-label="Color theme">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      role="radio"
      class="theme-toggle__btn"
      :class="{ 'is-on': preference === option.id }"
      :aria-checked="preference === option.id"
      :aria-label="option.label"
      :title="option.label"
      @click="setPreference(option.id)"
    >
      <svg v-if="option.id === 'light'" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1l1.1-1.1M18 6l1.1-1.1"
        />
      </svg>
      <svg v-else-if="option.id === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
          d="M16.4 13.2A6.2 6.2 0 0 1 10.8 4.8 7 7 0 1 0 19.2 13a6.2 6.2 0 0 1-2.8.2Z"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="5.5"
          width="16"
          height="11"
          rx="1.6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M8 19.5h8" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  padding: 2px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgb(var(--bg-elev-rgb) / 0.72);
}

.theme-toggle__btn {
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: var(--muted);
}

.theme-toggle__btn svg {
  width: 0.92rem;
  height: 0.92rem;
}

.theme-toggle__btn.is-on {
  background: var(--bg-elev-2);
  color: var(--text);
}

.theme-toggle__btn:hover {
  color: var(--text);
}

@media (min-width: 860px) {
  .theme-toggle__btn {
    width: 1.9rem;
    height: 1.9rem;
  }
}
</style>
