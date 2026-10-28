<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  links: { to: RouteLocationRaw; label: string; index?: string }[]
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

async function go(event: Event, to: RouteLocationRaw) {
  event.preventDefault()
  await router.push(to)
  emit('close')
}
</script>

<template>
  <div class="mobile-menu" role="dialog" aria-label="Navigation">
    <p class="kicker">&gt;_ $ ls ~/nav</p>
    <nav>
      <RouterLink
        v-for="link in links"
        :key="link.index ?? String(link.to)"
        :to="link.to"
        class="mobile-menu__link"
        @click="go($event, link.to)"
      >
        <span>{{ link.index }}</span>
        {{ link.label }}
      </RouterLink>
    </nav>
    <button type="button" class="mobile-menu__close" @click="emit('close')">esc / close</button>
  </div>
</template>

<style scoped>
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgb(var(--bg-rgb) / 0.97);
  padding: calc(var(--nav-h) + 1.5rem) var(--page-pad) 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.mobile-menu__link {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 7vw, 2rem);
  letter-spacing: -0.03em;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--line);
  transition: padding 0.4s var(--ease);
}

.mobile-menu__link span {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--olive);
}

.mobile-menu__link:hover {
  padding-left: 0.4rem;
  color: var(--earth);
}

.mobile-menu__close {
  margin-top: auto;
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
</style>
