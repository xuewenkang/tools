<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Close, Operation } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import CollageControls from '../components/collage/CollageControls.vue'
import ImageUploadPanel from '../components/collage/ImageUploadPanel.vue'
import PreviewStage from '../components/collage/PreviewStage.vue'

const router = useRouter()
const isPanelOpen = ref(false)
</script>

<template>
  <main class="studio" :class="{ 'is-panel-open': isPanelOpen }">
    <PreviewStage />

    <button class="mobile-panel-trigger" type="button" @click="isPanelOpen = true">
      <el-icon><Operation /></el-icon>
      参数与上传
    </button>

    <div class="mobile-scrim" @click="isPanelOpen = false" />

    <aside class="studio-sidebar" :class="{ 'is-open': isPanelOpen }">
      <div class="mobile-sheet-header">
        <div>
          <span>Batch Collage Studio</span>
          <strong>工作台设置</strong>
        </div>
        <el-button :icon="Close" circle text @click="isPanelOpen = false" />
      </div>

      <el-button class="back-button" :icon="ArrowLeft" text @click="router.push({ name: 'home' })">工具盒子</el-button>
      <ImageUploadPanel />
      <CollageControls />
    </aside>
  </main>
</template>
