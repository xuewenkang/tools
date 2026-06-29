<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, Minus, Plus } from '@element-plus/icons-vue'
import { usePreviewRenderer } from '../../composables/usePreviewRenderer'
import { exportCollageZip } from '../../services/exportService'
import { useCollageStore } from '../../stores/collageStore'

const store = useCollageStore()
const zoom = ref(0.72)
const isExporting = ref(false)
const { previewUrl, isRendering } = usePreviewRenderer(() => store.currentGroup, () => store.settings)

const transformStyle = computed(() => ({ transform: `scale(${zoom.value})` }))

async function exportZip(): Promise<void> {
  if (store.groups.length === 0) return
  isExporting.value = true
  await exportCollageZip(store.groups, store.settings)
  isExporting.value = false
}
</script>

<template>
  <section class="preview-shell">
    <header class="studio-header">
      <div>
        <span>Batch Collage Studio</span>
        <h1>批量拼图工具</h1>
      </div>
      <div class="studio-stats">
        <strong>{{ store.images.length }}</strong><span>图片</span>
        <strong>{{ store.totalPages }}</strong><span>预计生成</span>
        <el-button type="primary" :icon="Download" :loading="isExporting" :disabled="store.totalPages === 0" @click="exportZip">导出 ZIP</el-button>
      </div>
    </header>

    <div class="preview-toolbar">
      <el-button :icon="Minus" circle @click="zoom = Math.max(0.25, zoom - 0.1)" />
      <el-slider v-model="zoom" :min="0.25" :max="1.6" :step="0.05" />
      <el-button :icon="Plus" circle @click="zoom = Math.min(1.6, zoom + 0.1)" />
      <el-button @click="zoom = 0.72">Fit</el-button>
      <el-pagination
        small
        layout="prev, pager, next"
        :page-size="1"
        :total="store.totalPages"
        :current-page="store.currentPage"
        @current-change="store.setPage"
      />
    </div>

    <div class="preview-canvas" @wheel.prevent="zoom += $event.deltaY > 0 ? -0.04 : 0.04">
      <div v-if="store.currentGroup.length === 0" class="empty-state">
        <strong>上传图片后开始实时预览</strong>
        <span>所有处理都在浏览器本地完成，不会上传服务器。</span>
      </div>
      <div v-else class="preview-frame" :style="transformStyle">
        <img v-if="previewUrl" :src="previewUrl" alt="拼图预览" />
        <div v-if="isRendering" class="rendering">渲染中</div>
      </div>
    </div>
  </section>
</template>
