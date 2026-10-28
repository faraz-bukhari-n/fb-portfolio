<script setup lang="ts">
import { identity } from '@/content'
import { githubAvatarUrl } from '@/composables/useGithubContributions'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type IconName = 'code' | 'terminal' | 'grid' | 'briefcase' | 'star' | 'cpu' | 'user' | 'mail'

type RailItem = {
  id: string
  label: string
  to: string
  hash?: string
  icon: IconName
}

const items: RailItem[] = [
  { id: 'home', label: 'Home', to: '/', hash: '#hero', icon: 'code' },
  { id: 'climb', label: 'Climb', to: '/', hash: '#climb', icon: 'terminal' },
  { id: 'work', label: 'Work', to: '/work', icon: 'grid' },
  { id: 'experience', label: 'Experience', to: '/experience', icon: 'briefcase' },
  { id: 'career', label: 'Career', to: '/highlights', hash: '#highlights', icon: 'star' },
  { id: 'skills', label: 'Skills', to: '/', hash: '#skills', icon: 'cpu' },
  { id: 'about', label: 'About', to: '/about', icon: 'user' },
  { id: 'contact', label: 'Contact', to: '/', hash: '#contact', icon: 'mail' },
]

const homeSpy: Record<string, string> = {
  hero: 'home',
  climb: 'climb',
  highlights: 'career',
  skills: 'skills',
  contact: 'contact',
}

const route = useRoute()
const router = useRouter()
const reduced = usePrefersReducedMotion()
const active = ref('home')
const localAvatar = `${import.meta.env.BASE_URL}avatar.jpg`.replace(/\/{2,}/g, '/')
const avatar = ref(githubAvatarUrl(80) || localAvatar)

function onAvatarError() {
  if (avatar.value !== localAvatar) avatar.value = localAvatar
}

const onHome = computed(() => route.path === '/')

function syncFromRoute() {
  if (onHome.value) {
    if (route.hash === '#climb') active.value = 'climb'
    else if (route.hash === '#highlights') active.value = 'career'
    else if (route.hash === '#skills') active.value = 'skills'
    else if (route.hash === '#contact') active.value = 'contact'
    else active.value = 'home'
    return
  }
  const match = items.find((item) => item.to !== '/' && route.path.startsWith(item.to))
  active.value = match?.id ?? 'home'
}

function scrollToHash(hash: string) {
  const el = document.querySelector(hash)
  if (!el) return
  el.scrollIntoView({ behavior: reduced.value ? 'auto' : 'smooth', block: 'start' })
}

async function go(item: RailItem) {
  const homeTarget = item.hash?.slice(1)
  if (onHome.value && homeTarget && document.getElementById(homeTarget)) {
    active.value = item.id
    scrollToHash(item.hash!)
    return
  }

  if (item.to === '/' && item.hash) {
    await router.push({ path: '/', hash: item.hash })
    await nextTick()
    requestAnimationFrame(() => scrollToHash(item.hash!))
    return
  }

  await router.push(item.to)
}

async function goTop() {
  if (onHome.value) {
    active.value = 'home'
    window.scrollTo({ top: 0, behavior: reduced.value ? 'auto' : 'smooth' })
    return
  }
  await router.push('/')
}

let observer: IntersectionObserver | undefined

function bindSpy() {
  observer?.disconnect()
  if (!onHome.value) return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      const id = visible[0]?.target.id
      if (id && homeSpy[id]) active.value = homeSpy[id]
    },
    { rootMargin: '-28% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] },
  )
  for (const id of Object.keys(homeSpy)) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
}

watch(
  () => route.fullPath,
  async () => {
    syncFromRoute()
    await nextTick()
    bindSpy()
    if (onHome.value && route.hash) {
      requestAnimationFrame(() => scrollToHash(route.hash))
    }
  },
)

onMounted(async () => {
  syncFromRoute()
  await nextTick()
  bindSpy()
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <nav class="rail" aria-label="Section navigation">
    <span class="rail__line" aria-hidden="true" />
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="rail__item"
      :class="{ 'is-active': active === item.id }"
      :aria-label="item.label"
      :aria-current="active === item.id ? 'location' : undefined"
      @click="go(item)"
    >
      <span class="rail__tip">
        <em>&gt;</em>
        {{ item.label }}
      </span>
      <span class="rail__ring" aria-hidden="true" />
      <span class="rail__dot">
        <span class="rail__icon">
          <svg v-if="item.icon === 'code'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
          <svg v-else-if="item.icon === 'terminal'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <svg v-else-if="item.icon === 'grid'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <svg v-else-if="item.icon === 'briefcase'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            <path d="M2 13h20" />
          </svg>
          <svg v-else-if="item.icon === 'star'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg v-else-if="item.icon === 'cpu'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="16" height="16" x="4" y="4" rx="2" />
            <rect width="6" height="6" x="9" y="9" rx="1" />
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
          </svg>
          <svg v-else-if="item.icon === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
          </svg>
        </span>
      </span>
    </button>
    <button type="button" class="rail__face" aria-label="Top" @click="goTop">
      <img :src="avatar" :alt="identity.name" width="32" height="32" @error="onAvatarError" />
    </button>
  </nav>
</template>

<style scoped>
.rail {
  display: none;
}

@media (min-width: 980px) {
  .rail {
    position: fixed;
    top: 50%;
    right: 1.6rem;
    z-index: 60;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    transform: translateY(-50%);
  }
}

@media (min-width: 1200px) {
  .rail {
    right: 2rem;
  }
}

.rail__line {
  position: absolute;
  top: 0;
  bottom: 2.6rem;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgb(var(--olive-rgb) / 0.22), transparent);
  pointer-events: none;
}

.rail__item {
  position: relative;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.rail__tip {
  position: absolute;
  right: 2.6rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.55rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.22);
  border-radius: 6px;
  background: var(--bg-elev);
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(8px);
  pointer-events: none;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.rail__tip em {
  font-style: normal;
  color: var(--olive);
}

.rail__item:hover .rail__tip {
  opacity: 1;
  transform: none;
}

.rail__item.is-active:hover .rail__tip {
  color: var(--text);
}

.rail__item.is-active:hover .rail__tip em {
  color: var(--olive);
}

.rail__ring {
  position: absolute;
  inset: 2px;
  border: 1px dashed rgb(var(--olive-rgb) / 0.55);
  border-radius: 999px;
  opacity: 0;
  transform: rotate(0deg);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.rail__item.is-active .rail__ring {
  opacity: 1;
  transform: rotate(180deg);
}

.rail__dot {
  position: relative;
  z-index: 1;
  width: 0.5rem;
  height: 0.5rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--bg-elev-2);
  color: var(--olive);
  overflow: hidden;
  transition:
    width 0.3s ease,
    height 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.rail__item:hover .rail__dot {
  width: 0.75rem;
  height: 0.75rem;
  border-color: rgb(var(--olive-rgb) / 0.5);
  background: rgb(var(--olive-rgb) / 0.18);
}

.rail__item.is-active .rail__dot {
  width: 1.75rem;
  height: 1.75rem;
  border-color: var(--olive);
  background: var(--bg);
  box-shadow: 0 0 20px rgb(var(--olive-rgb) / 0.28);
}

.rail__icon {
  display: grid;
  place-items: center;
  width: 0;
  height: 0;
  opacity: 0;
  transform: scale(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    width 0.3s ease,
    height 0.3s ease;
}

.rail__item.is-active .rail__icon {
  width: 1rem;
  height: 1rem;
  opacity: 1;
  transform: scale(1);
}

.rail__icon svg {
  width: 100%;
  height: 100%;
}

.rail__face {
  position: relative;
  z-index: 1;
  width: 2rem;
  height: 2rem;
  margin-top: 0.35rem;
  overflow: hidden;
  border: 2px solid rgb(var(--olive-rgb) / 0.4);
  border-radius: 999px;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.rail__face img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rail__face:hover {
  transform: scale(1.1);
  border-color: var(--olive);
  box-shadow: 0 0 15px rgb(var(--olive-rgb) / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .rail__ring,
  .rail__dot,
  .rail__icon,
  .rail__tip,
  .rail__face {
    transition: none;
  }
}
</style>
