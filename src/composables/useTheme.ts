import { useMediaQuery, useStorage } from '@vueuse/core'
import { computed, watch } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function useTheme() {
  const preference = useStorage<ThemePreference>(STORAGE_KEY, 'system', undefined, {
    serializer: {
      read: (raw) => (isPreference(raw) ? raw : 'system'),
      write: (value) => value,
    },
  })
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const resolved = computed<ResolvedTheme>(() => {
    if (preference.value === 'system') return prefersDark.value ? 'dark' : 'light'
    return preference.value
  })

  watch(
    resolved,
    (theme) => {
      const root = document.documentElement
      root.dataset.theme = theme
      root.style.colorScheme = theme
    },
    { immediate: true },
  )

  function setPreference(next: ThemePreference) {
    preference.value = next
  }

  return { preference, resolved, setPreference }
}
