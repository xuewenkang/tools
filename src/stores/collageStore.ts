import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { DEFAULT_SETTINGS } from '../constants/collage'
import { loadImageAsset } from '../services/imageLoader'
import { splitIntoGroups } from '../services/layoutEngine'
import type { CollageSettings, ImageAsset } from '../types/collage'

export const useCollageStore = defineStore('collage', () => {
  const images = ref<ImageAsset[]>([])
  const settings = ref<CollageSettings>({ ...DEFAULT_SETTINGS })
  const currentPage = ref(1)
  const isLoading = ref(false)

  const groups = computed(() => splitIntoGroups(images.value, settings.value))
  const totalPages = computed(() => groups.value.length)
  const currentGroup = computed(() => groups.value[Math.max(0, currentPage.value - 1)] ?? [])

  async function addFiles(fileList: FileList | File[]): Promise<void> {
    isLoading.value = true
    const files = Array.from(fileList)
    const loaded = await Promise.all(files.map((file) => loadImageAsset(file)))
    images.value.push(...loaded.filter((item): item is ImageAsset => Boolean(item)))
    currentPage.value = 1
    isLoading.value = false
  }

  function removeImage(id: string): void {
    const target = images.value.find((image) => image.id === id)
    if (target) URL.revokeObjectURL(target.url)
    images.value = images.value.filter((image) => image.id !== id)
    currentPage.value = Math.min(currentPage.value, Math.max(1, totalPages.value))
  }

  function clearImages(): void {
    images.value.forEach((image) => URL.revokeObjectURL(image.url))
    images.value = []
    currentPage.value = 1
  }

  function setPage(page: number): void {
    currentPage.value = Math.min(Math.max(page, 1), Math.max(totalPages.value, 1))
  }

  return {
    images,
    settings,
    currentPage,
    isLoading,
    groups,
    totalPages,
    currentGroup,
    addFiles,
    removeImage,
    clearImages,
    setPage,
  }
})
