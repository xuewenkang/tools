<script setup lang="ts">
import { computed } from 'vue'
import { EXPORT_SIZES, IMAGE_COUNTS } from '../../constants/collage'
import { AUTO_LAYOUTS } from '../../constants/collage'
import { useCollageStore } from '../../stores/collageStore'

const store = useCollageStore()
const layoutOptions = computed(() => AUTO_LAYOUTS[store.settings.imagesPerCollage] ?? [])
</script>

<template>
  <div class="control-stack">
    <section class="panel">
      <div class="panel__title">拼图参数</div>
      <label>每张拼图包含</label>
      <el-select v-model="store.settings.imagesPerCollage">
        <el-option v-for="count in IMAGE_COUNTS" :key="count" :label="`${count} 张`" :value="count" />
        <el-option label="自定义" :value="0" />
      </el-select>
      <el-input-number v-if="store.settings.imagesPerCollage === 0" v-model="store.settings.customImagesPerCollage" :min="1" :max="100" />

      <label>布局</label>
      <el-segmented v-model="store.settings.layoutMode" :options="[{ label: '自动', value: 'auto' }, { label: '自定义', value: 'custom' }]" />
      <div v-if="store.settings.layoutMode === 'custom'" class="inline-controls">
        <el-input-number v-model="store.settings.rows" :min="1" :max="12" controls-position="right" />
        <el-input-number v-model="store.settings.columns" :min="1" :max="12" controls-position="right" />
      </div>
      <div v-else class="layout-hint">{{ layoutOptions.map((item) => item.label).join(' / ') || '自动匹配' }}</div>

      <label>最后不足数量</label>
      <el-select v-model="store.settings.remainderMode">
        <el-option label="保留空白" value="blank" />
        <el-option label="重复最后一张" value="repeat-last" />
        <el-option label="忽略不足数量" value="ignore" />
      </el-select>
    </section>

    <section class="panel">
      <div class="panel__title">图片参数</div>
      <label>填充方式</label>
      <el-segmented v-model="store.settings.fitMode" :options="['cover', 'contain', 'stretch', 'center']" />
      <label>间距</label>
      <el-slider v-model="store.settings.gap" :min="0" :max="80" />
      <label>圆角</label>
      <el-slider v-model="store.settings.radius" :min="0" :max="80" />
      <label>背景色</label>
      <el-color-picker v-model="store.settings.background" />
      <el-checkbox v-model="store.settings.transparent">透明背景</el-checkbox>
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
      <label>质量</label>
      <el-slider v-model="store.settings.exportQuality" :min="0.8" :max="1" :step="0.05" />
      <label>尺寸</label>
      <el-select v-model="store.settings.exportSize">
        <el-option v-for="size in EXPORT_SIZES" :key="size" :label="`${size} x ${size}`" :value="size" />
      </el-select>
    </section>
  </div>
</template>
