<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    prompt?: string
    flush?: boolean
  }>(),
  { flush: false },
)
</script>

<template>
  <section class="pane">
    <header class="pane__bar">
      <span class="pane__dots" aria-hidden="true"><i /><i /><i /></span>
      <span class="pane__title">{{ title }}</span>
      <span v-if="prompt" class="pane__prompt">{{ prompt }}</span>
    </header>
    <div :class="['pane__body', { 'is-flush': flush }]">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.pane {
  min-width: 0;
  border: 1px solid transparent;
  border-radius: 16px;
  background:
    linear-gradient(rgb(var(--bg-elev-rgb) / 0.92), rgb(var(--bg-elev-rgb) / 0.92)) padding-box,
    linear-gradient(120deg, rgb(var(--olive-rgb) / 0.75), rgb(var(--cyan-rgb) / 0.55)) border-box;
  box-shadow: var(--glow-cyan);
  overflow: visible;
}

.pane__bar {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 2.5rem;
  padding: 0 0.9rem;
  border-bottom: 1px solid var(--line);
  background: rgb(var(--bg-rgb) / 0.35);
}

.pane__dots {
  display: flex;
  gap: 0.35rem;
  flex-shrink: 0;
}

.pane__dots i {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--dot-red);
}

.pane__dots i:nth-child(2) {
  background: var(--dot-gold);
}

.pane__dots i:nth-child(3) {
  background: var(--dot-green);
}

.pane__title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pane__prompt {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--olive);
  white-space: nowrap;
}

.pane__body {
  padding: 1.15rem 1.15rem 1.25rem;
}

.pane__body.is-flush {
  padding: 0;
  overflow: hidden;
}
</style>
