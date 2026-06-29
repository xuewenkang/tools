<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import CollageControls from '../components/collage/CollageControls.vue'
import ImageUploadPanel from '../components/collage/ImageUploadPanel.vue'
import PreviewStage from '../components/collage/PreviewStage.vue'

const router = useRouter()
</script>

<template>
  <main class="studio">
    <aside class="studio-sidebar">
      <el-button class="back-button" :icon="ArrowLeft" text @click="router.push({ name: 'home' })">工具盒子</el-button>
      <ImageUploadPanel />
      <CollageControls />
    </aside>
    <PreviewStage />
  </main>
</template>
