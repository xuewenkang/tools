<script setup lang="ts">
import type { ToolManifest } from '../types/tool'

defineProps<{ tool: ToolManifest }>()
</script>

<template>
  <article class="tool-card" :class="{ 'is-disabled': tool.status === 'soon' }">
    <div class="tool-card__icon" :style="{ color: tool.accent, backgroundColor: `${tool.accent}14` }">
      <component :is="tool.icon" />
    </div>
    <div>
      <div class="tool-card__meta">
        <span>{{ tool.subtitle }}</span>
        <strong>{{ tool.status === 'ready' ? '已完成' : '开发中' }}</strong>
      </div>
      <h2>{{ tool.name }}</h2>
      <p>{{ tool.description }}</p>
    </div>
  </article>
</template>
