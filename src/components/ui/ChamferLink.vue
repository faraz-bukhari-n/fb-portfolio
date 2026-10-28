<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(
  defineProps<{
    to?: string
    href?: string
    tall?: boolean
    fill?: boolean
    glow?: 'warm' | 'hot' | 'cool'
  }>(),
  { tall: false, fill: false, glow: 'warm' },
)
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="cut"
    :class="[`cut--${glow}`, { 'is-tall': tall, 'is-fill': fill }]"
  >
    <span class="cut__glow" aria-hidden="true" />
    <span class="cut__face">
      <slot />
    </span>
  </RouterLink>
  <a
    v-else-if="href"
    :href="href"
    class="cut"
    :class="[`cut--${glow}`, { 'is-tall': tall, 'is-fill': fill }]"
    :target="href.startsWith('http') ? '_blank' : undefined"
    :rel="href.startsWith('http') ? 'noreferrer' : undefined"
  >
    <span class="cut__glow" aria-hidden="true" />
    <span class="cut__face">
      <slot />
    </span>
  </a>
  <button v-else type="button" class="cut" :class="[`cut--${glow}`, { 'is-tall': tall, 'is-fill': fill }]">
    <span class="cut__glow" aria-hidden="true" />
    <span class="cut__face">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.cut {
  --cut: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
  position: relative;
  display: inline-flex;
  isolation: isolate;
  color: inherit;
  cursor: pointer;
  overflow: visible;
}

.cut.is-fill {
  display: flex;
  width: 100%;
}

.cut__glow {
  position: absolute;
  inset: -2px;
  z-index: 0;
  clip-path: var(--cut);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.cut--warm .cut__glow {
  background: linear-gradient(90deg, rgb(var(--olive-rgb)), rgb(var(--cyan-rgb) / 0.45));
  opacity: 0.28;
}

.cut--hot .cut__glow {
  background: linear-gradient(90deg, rgb(var(--magenta-rgb)), rgb(var(--earth-rgb) / 0.5));
  opacity: 0.28;
}

.cut--cool .cut__glow {
  background: linear-gradient(90deg, rgb(var(--cyan-rgb)), rgb(var(--olive-rgb) / 0.45));
  opacity: 0.28;
}

.cut--warm:hover .cut__glow {
  opacity: 0.5;
}

.cut--hot:hover .cut__glow,
.cut--cool:hover .cut__glow {
  opacity: 0.7;
}

.cut__face {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 46px;
  padding: 12px 24px;
  border: 1px solid rgb(var(--olive-rgb) / 0.32);
  background: var(--bg-elev);
  color: var(--text);
  box-shadow: 0 20px 40px rgb(0 0 0 / 0.28);
  clip-path: var(--cut);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.cut--hot .cut__face {
  border-color: rgb(var(--magenta-rgb) / 0.38);
}

.cut--cool .cut__face {
  border-color: rgb(var(--cyan-rgb) / 0.38);
}

.cut.is-fill .cut__face {
  width: 100%;
}

.cut.is-tall .cut__face {
  min-height: 79px;
  padding: 16px;
  gap: 0.75rem;
}

.cut:hover .cut__face {
  background: var(--bg-elev-2);
  border-color: rgb(var(--olive-rgb) / 0.55);
}

.cut--hot:hover .cut__face {
  border-color: rgb(var(--magenta-rgb) / 0.62);
}

.cut--cool:hover .cut__face {
  border-color: rgb(var(--cyan-rgb) / 0.62);
}

@media (max-width: 520px) {
  .cut {
    --cut: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
  }

  .cut.is-tall .cut__face {
    min-height: 72px;
    padding: 12px;
  }
}
</style>
