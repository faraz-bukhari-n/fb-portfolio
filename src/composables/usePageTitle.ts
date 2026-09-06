import { identity } from '@/content'
import { useHead } from '@unhead/vue'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function usePageTitle(title: MaybeRefOrGetter<string>) {
  useHead({
    title: computed(() => {
      const page = toValue(title)
      return page ? `${page} · ${identity.name}` : `${identity.name} · ${identity.role}`
    }),
  })
}
