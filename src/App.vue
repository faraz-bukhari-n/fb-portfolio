<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
import { useTheme } from '@/composables/useTheme'
import { useRoute } from 'vue-router'

useTheme()
const route = useRoute()
</script>

<template>
  <AppShell>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </AppShell>
</template>
