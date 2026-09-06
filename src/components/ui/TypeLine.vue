<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  text: string
  reduced?: boolean
}>()

const shown = ref(props.reduced ? props.text : '')

onMounted(() => {
  if (props.reduced) return
  let i = 0
  const tick = () => {
    i += 1
    shown.value = props.text.slice(0, i)
    if (i < props.text.length) window.setTimeout(tick, 28)
  }
  tick()
})
</script>

<template>
  <span>{{ shown }}<span class="caret" aria-hidden="true">█</span></span>
</template>

<style scoped>
.caret {
  color: var(--cyan);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }
}
</style>
