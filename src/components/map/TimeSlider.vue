<script setup lang="ts">
defineProps<{
  modelValue: number
  max: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <label class="time-slider">
    <span class="kicker">t = {{ modelValue.toFixed(1) }}s</span>
    <input
      type="range"
      min="0"
      :max="max"
      step="0.05"
      :value="modelValue"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
  </label>
</template>

<style scoped>
.time-slider {
  display: grid;
  gap: 0.35rem;
  background: rgba(251, 248, 242, 0.92);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0.7rem 0.9rem;
  backdrop-filter: blur(14px);
}

input {
  width: 100%;
  accent-color: var(--magenta);
}
</style>
