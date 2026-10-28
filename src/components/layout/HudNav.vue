<script setup lang="ts">
import { identity } from '@/content'
import MobileMenu from './MobileMenu.vue'
import ThemeToggle from './ThemeToggle.vue'
import { onKeyStroke, useMediaQuery } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

const route = useRoute()
const router = useRouter()
const links: { id: string; to: RouteLocationRaw; label: string; index: string }[] = [
  { id: 'work', to: '/work', label: 'Work', index: '01' },
  { id: 'experience', to: '/experience', label: 'Experience', index: '02' },
  { id: 'career', to: '/highlights', label: 'Career', index: '03' },
  { id: 'skills', to: { name: 'home', hash: '#skills' }, label: 'Skills', index: '04' },
]

function isActive(id: string, to: RouteLocationRaw) {
  if (id === 'skills') return route.path === '/' && route.hash === '#skills'
  const path = typeof to === 'string' ? to : 'path' in to ? to.path : ''
  return Boolean(path && (route.path === path || route.path.startsWith(`${path}/`)))
}

async function go(event: Event, to: RouteLocationRaw) {
  event.preventDefault()
  open.value = false
  await router.push(to)
}
const open = ref(false)
const isMobile = useMediaQuery('(max-width: 860px)')
const onHome = computed(() => Boolean(route.meta.fullBleed))

watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)

watch(isMobile, (mobile) => {
  if (!mobile) open.value = false
})

onKeyStroke('Escape', () => {
  open.value = false
})
</script>

<template>
  <header class="hud-nav" :class="{ 'hud-nav--home': onHome }">
    <RouterLink to="/" class="hud-nav__brand" aria-label="Home">
      <span class="hud-nav__mark">{{ identity.shortName }}</span>
      <span class="hud-nav__role">{{ identity.role.split('·')[0] }}</span>
    </RouterLink>

    <nav v-if="!isMobile" class="hud-nav__links" aria-label="Primary">
      <RouterLink
        v-for="link in links"
        :key="link.id"
        :to="link.to"
        class="hud-nav__link"
        :class="{ 'is-active': isActive(link.id, link.to) }"
        @click="go($event, link.to)"
      >
        <span>{{ link.index }}</span>
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="hud-nav__end">
      <ThemeToggle />
      <RouterLink class="hud-nav__resume" :to="identity.resumePath">Resume</RouterLink>
      <button
        v-if="isMobile"
        type="button"
        class="hud-nav__burger"
        :aria-expanded="open"
        aria-label="Open menu"
        @click="open = !open"
      >
        <span /><span /><span />
      </button>
    </div>
  </header>

  <MobileMenu v-if="open && isMobile" :links="links" @close="open = false" />
</template>

<style scoped>
.hud-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 var(--page-pad);
  border-bottom: 1px solid var(--line);
  background: rgb(var(--bg-rgb) / 0.72);
  backdrop-filter: blur(22px);
}

.hud-nav--home {
  background: linear-gradient(to bottom, rgb(var(--bg-rgb) / 0.86), transparent);
  border-bottom-color: transparent;
}

.hud-nav__brand {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  min-width: 0;
}

.hud-nav__mark {
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--olive);
  border: 1px solid var(--olive);
  border-radius: 4px;
  padding: 0.18rem 0.48rem;
  flex-shrink: 0;
}

.hud-nav__role {
  display: none;
  font-size: 0.78rem;
  color: var(--muted);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hud-nav__links {
  display: flex;
  gap: 0.2rem;
}

.hud-nav__link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.4rem 0.55rem;
  color: var(--muted);
}

.hud-nav__link span {
  color: var(--olive);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
}

.hud-nav__link:hover,
.hud-nav__link.is-active {
  color: var(--cyan);
}

.hud-nav__end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.hud-nav__resume {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--olive);
  border: 1px solid var(--olive);
  border-radius: var(--radius-sm);
  padding: 0.34rem 0.65rem;
  white-space: nowrap;
  transition:
    background 0.35s var(--ease),
    color 0.35s var(--ease);
}

.hud-nav__resume:hover {
  background: var(--cyan);
  border-color: var(--cyan);
  color: var(--bg);
}

.hud-nav__burger {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  gap: 4px;
}

.hud-nav__burger span {
  display: block;
  width: 18px;
  height: 1px;
  background: var(--olive);
}

@media (min-width: 860px) {
  .hud-nav {
    gap: 1rem;
  }

  .hud-nav__role {
    display: inline;
  }

  .hud-nav__resume {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    padding: 0.38rem 0.75rem;
  }

  .hud-nav__end {
    gap: 0.75rem;
  }
}
</style>
