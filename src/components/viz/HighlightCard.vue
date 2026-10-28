<script setup lang="ts">
import CardGo from '@/components/ui/CardGo.vue'
import type { CareerHighlight } from '@/content'
import { RouterLink } from 'vue-router'

defineProps<{
  highlight: CareerHighlight
  detailed?: boolean
}>()
</script>

<template>
  <component
    :is="highlight.href ? RouterLink : 'article'"
    v-bind="highlight.href ? { to: highlight.href } : {}"
    class="hl-card"
    :class="{ 'is-link': Boolean(highlight.href) }"
  >
    <div class="hl-card__bar">
      <span class="hl-card__dots" aria-hidden="true"><i /><i /><i /></span>
      <span>highlights/{{ highlight.id }}.md</span>
    </div>
    <div class="hl-card__body">
      <p class="kicker">{{ highlight.year }} · {{ highlight.kicker }}</p>
      <h3>{{ highlight.title }}</h3>
      <p>{{ highlight.line }}</p>
      <p v-if="detailed" class="hl-card__detail">{{ highlight.detail }}</p>
      <CardGo v-if="highlight.href" />
    </div>
  </component>
</template>

<style scoped>
.hl-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 14px;
  background:
    linear-gradient(rgb(var(--bg-elev-rgb) / 0.92), rgb(var(--bg-elev-rgb) / 0.92)) padding-box,
    linear-gradient(120deg, rgb(var(--olive-rgb) / 0.4), rgb(var(--cyan-rgb) / 0.4)) border-box;
  color: inherit;
  text-align: left;
  text-decoration: none;
  transition:
    transform 0.35s var(--ease),
    box-shadow 0.35s var(--ease);
}

.hl-card.is-link {
  cursor: pointer;
}

.hl-card.is-link:hover,
.hl-card.is-link:focus-visible {
  transform: translateY(-4px);
  box-shadow: var(--glow-cyan);
}

.hl-card.is-link:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 3px;
}

.hl-card.is-link:hover :deep(.card-go),
.hl-card.is-link:focus-visible :deep(.card-go) {
  color: var(--cyan);
}

.hl-card.is-link:hover :deep(.card-go svg),
.hl-card.is-link:focus-visible :deep(.card-go svg) {
  transform: translateX(4px);
}

.hl-card__bar {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.9rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.hl-card__dots {
  display: flex;
  gap: 0.28rem;
}

.hl-card__dots i {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: var(--dot-red);
}

.hl-card__dots i:nth-child(2) {
  background: var(--dot-gold);
}

.hl-card__dots i:nth-child(3) {
  background: var(--dot-green);
}

.hl-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.05rem 1.1rem 1.15rem;
}

.hl-card .kicker {
  margin: 0 0 0.55rem;
}

h3 {
  margin: 0 0 0.45rem;
  font-size: clamp(1.12rem, 3.5vw, 1.35rem);
  letter-spacing: -0.04em;
}

.hl-card__body > p:not(.kicker):not(.hl-card__detail) {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
  flex: 1;
}

.hl-card__detail {
  margin: 0.75rem 0 0;
  color: var(--text);
  line-height: 1.6;
}
</style>
