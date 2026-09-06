<script setup lang="ts">
import { playgroundLayers, type LayerId } from '@/content/playground-layers'

defineProps<{
  active: Record<LayerId, boolean>
}>()

const emit = defineEmits<{
  toggle: [id: LayerId]
}>()
</script>

<template>
  <section class="layer-dock" aria-label="Map layers">
    <p class="kicker">layers</p>
    <ul>
      <li v-for="layer in playgroundLayers" :key="layer.id">
        <label>
          <input
            type="checkbox"
            :checked="active[layer.id]"
            @change="emit('toggle', layer.id)"
          />
          <span>{{ layer.label }}</span>
        </label>
        <p>{{ layer.note }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.layer-dock {
  background: rgba(251, 248, 242, 0.92);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0.9rem 1rem 1rem;
  backdrop-filter: blur(14px);
  max-height: min(70vh, 560px);
  overflow: auto;
}

ul {
  list-style: none;
  margin: 0.7rem 0 0;
  padding: 0;
}

li + li {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}

label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

input {
  accent-color: var(--cyan);
}

li p {
  margin: 0.35rem 0 0 1.45rem;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.45;
}
</style>
