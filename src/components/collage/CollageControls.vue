<script setup lang="ts">
import { computed } from 'vue'
import { ASPECT_RATIOS, EXPORT_SIZES, IMAGE_COUNTS } from '../../constants/collage'
import { useCollageStore } from '../../stores/collageStore'
import type { LayoutPreset } from '../../types/collage'

const store = useCollageStore()

const layoutTemplates: LayoutPreset[] = [
  { label: '1 x 2', rows: 1, columns: 2 },
  { label: '2 x 1', rows: 2, columns: 1 },
  { label: '2 x 2', rows: 2, columns: 2 },
  { label: '3 x 1', rows: 3, columns: 1 },
  { label: '2 x 3', rows: 2, columns: 3 },
  { label: '3 x 2', rows: 3, columns: 2 },
  { label: '3 x 3', rows: 3, columns: 3 },
  { label: '4 x 3', rows: 4, columns: 3 },
]

const selectedLayoutLabel = computed(() => `${store.settings.rows} x ${store.settings.columns}`)

function applyLayout(template: LayoutPreset): void {
  store.settings.layoutMode = 'custom'
  store.settings.rows = template.rows
  store.settings.columns = template.columns
  store.settings.imagesPerCollage = template.rows * template.columns
}

function useCustomLayout(): void {
  store.settings.layoutMode = 'custom'
  store.settings.imagesPerCollage = store.settings.rows * store.settings.columns
}
</script>

<template>
  <div class="control-stack">
    <section class="panel">
      <div class="panel__title">
        <span>尺寸与模板</span>
        <small>统一配置</small>
      </div>
      <div class="ratio-pills" aria-label="画布比例">
        <button
          v-for="ratio in ASPECT_RATIOS"
          :key="ratio.id"
          type="button"
          :class="{ active: store.settings.aspectRatio === ratio.id }"
          @click="store.settings.aspectRatio = ratio.id"
        >
          {{ ratio.label }}
        </button>
      </div>
      <div class="layout-template-grid" aria-label="布局模板">
        <button
          v-for="template in layoutTemplates"
          :key="template.label"
          type="button"
          :class="{ active: selectedLayoutLabel === template.label }"
          @click="applyLayout(template)"
        >
          <span
            class="layout-preview"
            :style="{
              gridTemplateRows: `repeat(${template.rows}, 1fr)`,
              gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
            }"
          >
            <i v-for="cell in template.rows * template.columns" :key="cell" />
          </span>
          <em>{{ template.label }}</em>
        </button>
      </div>
    </section>

    <section class="panel">
      <div class="panel__title">拼图参数</div>
      <label>每张拼图包含</label>
      <el-select v-model="store.settings.imagesPerCollage">
        <el-option v-for="count in IMAGE_COUNTS" :key="count" :label="`${count} 张`" :value="count" />
        <el-option label="自定义" :value="0" />
      </el-select>
      <el-input-number v-if="store.settings.imagesPerCollage === 0" v-model="store.settings.customImagesPerCollage" :min="1" :max="100" />

      <label>布局模式</label>
      <el-segmented
        v-model="store.settings.layoutMode"
        :options="[
          { label: '自动', value: 'auto' },
          { label: '自定义', value: 'custom' },
        ]"
      />
      <div class="inline-controls">
        <el-input-number v-model="store.settings.rows" :min="1" :max="12" controls-position="right" @change="useCustomLayout" />
        <el-input-number v-model="store.settings.columns" :min="1" :max="12" controls-position="right" @change="useCustomLayout" />
      </div>

      <label>最后不足数量</label>
      <el-select v-model="store.settings.remainderMode">
        <el-option label="保留空白" value="blank" />
        <el-option label="重复最后一张" value="repeat-last" />
        <el-option label="忽略不足数量" value="ignore" />
      </el-select>
    </section>

    <section class="panel">
      <div class="panel__title">高级编辑</div>
      <label>填充方式</label>
      <el-segmented v-model="store.settings.fitMode" :options="['cover', 'contain', 'stretch', 'center']" />
      <label>白边 / 间距</label>
      <el-slider v-model="store.settings.gap" :min="0" :max="80" />
      <label>圆角</label>
      <el-slider v-model="store.settings.radius" :min="0" :max="80" />
      <label>背景色</label>
      <div class="inline-controls">
        <el-color-picker v-model="store.settings.background" />
        <el-checkbox v-model="store.settings.transparent">透明背景</el-checkbox>
      </div>
      <div class="inline-controls">
        <el-checkbox v-model="store.settings.shadow">阴影</el-checkbox>
        <el-checkbox v-model="store.settings.border">边框</el-checkbox>
      </div>
    </section>

    <section class="panel">
      <div class="panel__title">水印</div>
      <el-switch v-model="store.settings.textWatermarkEnabled" active-text="文字水印" />
      <el-input v-model="store.settings.watermarkText" :disabled="!store.settings.textWatermarkEnabled" />
      <label>字号</label>
      <el-slider v-model="store.settings.watermarkSize" :min="14" :max="120" />
      <label>透明度</label>
      <el-slider v-model="store.settings.watermarkOpacity" :min="0.05" :max="1" :step="0.05" />
      <label>旋转</label>
      <el-slider v-model="store.settings.watermarkRotation" :min="-90" :max="90" />
      <label>位置</label>
      <el-select v-model="store.settings.watermarkPosition">
        <el-option label="左上" value="top-left" />
        <el-option label="右上" value="top-right" />
        <el-option label="左下" value="bottom-left" />
        <el-option label="右下" value="bottom-right" />
        <el-option label="中心" value="center" />
        <el-option label="平铺" value="tile" />
      </el-select>
    </section>

    <section class="panel">
      <div class="panel__title">导出参数</div>
      <label>格式</label>
      <el-segmented v-model="store.settings.exportFormat" :options="['png', 'jpeg', 'webp']" />
      <label>长边尺寸</label>
      <el-select v-model="store.settings.exportSize">
        <el-option v-for="size in EXPORT_SIZES" :key="size" :label="`${size}px`" :value="size" />
      </el-select>
      <label>质量</label>
      <el-slider v-model="store.settings.exportQuality" :min="0.8" :max="1" :step="0.05" />
    </section>
  </div>
</template>
