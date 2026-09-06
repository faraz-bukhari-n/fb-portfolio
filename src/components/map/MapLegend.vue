<script setup lang="ts">
import { basemaps, type BasemapId } from '@/content/playground-layers'

defineProps<{
  modelValue: BasemapId
}>()

const emit = defineEmits<{
  'update:modelValue': [value: BasemapId]
}>()
</script>

<template>
  <div class="legend" aria-label="Basemap and legend">
    <p class="kicker">basemap</p>
    <div class="legend__row">
      <button
        v-for="item in basemaps"
        :key="item.id"
        type="button"
        :class="{ 'is-on': modelValue === item.id }"
        @click="emit('update:modelValue', item.id)"
      >
        {{ item.label }}
      </button>
    </div>
    <p class="kicker">legend</p>
    <ul>
      <li><i class="cyan" /> Projects / trips</li>
      <li><i class="magenta" /> Roles / arcs</li>
      <li><i class="mix" /> Density</li>
    </ul>
  </div>
</template>

<style scoped>
.legend {
  background: rgba(251, 248, 242, 0.92);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0.85rem 1rem;
  backdrop-filter: blur(14px);
}

.legend__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.45rem 0 0.9rem;
}

button {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.28rem 0.5rem;
  border: 1px solid var(--line);
  color: var(--muted);
}

button.is-on {
  color: var(--cyan);
  border-color: var(--cyan);
}

ul {
  list-style: none;
  margin: 0.4rem 0 0;
  padding: 0;
  font-size: 0.8rem;
  color: var(--muted);
}

li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

i {
  width: 10px;
  height: 10px;
  border-radius: 99px;
}

.cyan {
  background: var(--cyan);
  box-shadow: none;
}

.magenta {
  background: var(--magenta);
}

.mix {
  background: linear-gradient(90deg, var(--olive), var(--earth));
}
</style>
