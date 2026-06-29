<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, Minus, Plus } from '@element-plus/icons-vue'
import { usePreviewRenderer } from '../../composables/usePreviewRenderer'
import { exportCollageZip } from '../../services/exportService'
import { useCollageStore } from '../../stores/collageStore'

const store = useCollageStore()
const zoom = ref(1)
const isExporting = ref(false)
const { previewUrl, isRendering, dimensions } = usePreviewRenderer(() => store.currentGroup, () => store.settings)

const previewStyle = computed<Record<string, string>>(() => ({
  '--preview-ratio': `${dimensions.value.width / dimensions.value.height}`,
  aspectRatio: `${dimensions.value.width} / ${dimensions.value.height}`,
  transform: `scale(${zoom.value})`,
}))

const exportLabel = computed(() => `${dimensions.value.width} x ${dimensions.value.height}`)

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
      <div class="preview-toolbar">
        <el-button :icon="Minus" circle @click="zoom = Math.max(0.45, zoom - 0.08)" />
        <el-slider v-model="zoom" :min="0.45" :max="1.25" :step="0.04" />
        <el-button :icon="Plus" circle @click="zoom = Math.min(1.25, zoom + 0.08)" />
        <el-button @click="zoom = 1">Fit</el-button>
        <el-pagination
          small
          layout="prev, pager, next"
          :page-size="1"
          :total="store.totalPages"
          :current-page="store.currentPage"
          @current-change="store.setPage"
        />
      </div>
      <div class="studio-stats">
        <div class="stat-pill">
          <strong>{{ store.images.length }}</strong>
          <span>图片</span>
        </div>
        <div class="stat-pill">
          <strong>{{ store.totalPages }}</strong>
          <span>生成</span>
        </div>
        <div class="stat-pill stat-pill--wide">
          <strong>{{ store.settings.aspectRatio }}</strong>
          <span>{{ exportLabel }}</span>
        </div>
        <el-button type="primary" :icon="Download" :loading="isExporting" :disabled="store.totalPages === 0" @click="exportZip">
          导出 ZIP
        </el-button>
      </div>
    </header>

    <div class="preview-workspace" @wheel.prevent="zoom += $event.deltaY > 0 ? -0.04 : 0.04">
      <div class="preview-canvas">
        <div v-if="store.currentGroup.length === 0" class="empty-state">
          <strong>上传图片后开始实时预览</strong>
          <span>比例、模板与高级参数都在参数面板中统一设置。</span>
        </div>
        <div v-else class="preview-frame" :style="previewStyle">
          <img v-if="previewUrl" :src="previewUrl" alt="拼图预览" />
          <div v-if="isRendering" class="rendering">渲染中</div>
        </div>
      </div>
    </div>
  </section>
</template>
