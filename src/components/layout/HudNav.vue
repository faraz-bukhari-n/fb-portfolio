<script setup lang="ts">
import { identity } from '@/content'
import MobileMenu from './MobileMenu.vue'
import { onKeyStroke, useMediaQuery } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const links = [
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/work', label: 'Work' },
  { to: '/skills', label: 'Skills' },
  { to: '/writing', label: 'Writing' },
  { to: '/contact', label: 'Contact' },
]

const route = useRoute()
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
        :key="link.to"
        :to="link.to"
        class="hud-nav__link"
        active-class="is-active"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="hud-nav__end">
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
  background: rgba(243, 238, 230, 0.78);
  backdrop-filter: blur(16px);
}

.hud-nav--home {
  background: linear-gradient(to bottom, rgba(243, 238, 230, 0.86), transparent);
  border-bottom-color: transparent;
}

.hud-nav__brand {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  min-width: 0;
}

.hud-nav__mark {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  color: var(--olive);
  border: 1px solid var(--olive);
  border-radius: 8px;
  padding: 0.15rem 0.5rem;
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
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.4rem 0.55rem;
  color: var(--muted);
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
  font-family: var(--font-sans);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--earth);
  border: 1px solid var(--earth);
  border-radius: 999px;
  padding: 0.32rem 0.65rem;
  white-space: nowrap;
  transition:
    background 0.4s var(--ease),
    color 0.4s var(--ease);
}

.hud-nav__resume:hover {
  background: var(--earth);
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
