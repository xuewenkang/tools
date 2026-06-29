<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import ToolCard from '../components/ToolCard.vue'
import '../plugins/tools'
import { getTools } from '../plugins/toolRegistry'

const router = useRouter()
const tools = getTools()

function openTool(routeName?: string): void {
  if (routeName) router.push({ name: routeName })
}
</script>

<template>
  <AppShell>
    <main class="home">
      <section class="home-hero">
        <div>
          <span>AI ToolBox</span>
          <h1>工具盒子</h1>
          <p>专业级本地图片批处理工具，先从批量拼图开始，后续以插件方式扩展更多能力。</p>
        </div>
      </section>

      <section class="tool-grid">
        <button v-for="tool in tools" :key="tool.id" class="tool-button" :disabled="tool.status === 'soon'" @click="openTool(tool.routeName)">
          <ToolCard :tool="tool" />
        </button>
      </section>
    </main>
  </AppShell>
</template>
