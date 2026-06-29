<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { useCollageStore } from '../../stores/collageStore'
import { formatBytes } from '../../utils/file'

const store = useCollageStore()

async function onFilesSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  if (input.files) await store.addFiles(input.files)
  input.value = ''
}

async function onDrop(event: DragEvent): Promise<void> {
  event.preventDefault()
  if (event.dataTransfer?.files) await store.addFiles(event.dataTransfer.files)
}
</script>

<template>
  <section class="panel upload-panel">
    <div class="panel__title">
      <span>上传图片</span>
      <el-button text type="danger" :disabled="store.images.length === 0" @click="store.clearImages">清空</el-button>
    </div>

    <label class="upload-dropzone" @drop="onDrop" @dragover.prevent>
      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/heic,.heic" @change="onFilesSelected" />
      <el-icon><UploadFilled /></el-icon>
      <strong>拖拽或点击上传</strong>
      <span>支持 JPG、PNG、WEBP、GIF 第一帧、HEIC 浏览器可解码文件</span>
    </label>

    <div class="image-list">
      <div v-for="image in store.images" :key="image.id" class="image-row">
        <img :src="image.url" :alt="image.name" loading="lazy" />
        <div>
          <strong>{{ image.name }}</strong>
          <span>{{ image.width }} x {{ image.height }} · {{ formatBytes(image.size) }}</span>
        </div>
        <el-button circle text type="danger" @click="store.removeImage(image.id)">×</el-button>
      </div>
    </div>
  </section>
</template>
