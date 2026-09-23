<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  links: { to: string; label: string }[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="mobile-menu" role="dialog" aria-label="Navigation">
    <p class="kicker">Menu</p>
    <nav>
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="mobile-menu__link"
        @click="emit('close')"
      >
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
  gap: 0.8rem;
  font-family: var(--font-serif);
  font-size: clamp(1.55rem, 7vw, 2rem);
  letter-spacing: -0.03em;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--line);
  transition: padding 0.4s var(--ease);
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
