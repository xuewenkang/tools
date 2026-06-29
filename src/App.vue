<script setup lang="ts">
import { ref } from 'vue'
import FirstVisitGate from './components/FirstVisitGate.vue'

const ACCESS_KEY = 'ai-toolbox-entry-unlocked'
const isUnlocked = ref(localStorage.getItem(ACCESS_KEY) === 'true')

function handleUnlock(): void {
  localStorage.setItem(ACCESS_KEY, 'true')
  isUnlocked.value = true
}
</script>

<template>
  <RouterView v-if="isUnlocked" />
  <FirstVisitGate v-else @unlock="handleUnlock" />
</template>
